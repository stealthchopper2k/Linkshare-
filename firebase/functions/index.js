// eslint-disable-next-line import/no-unresolved
const { onRequest } = require('firebase-functions/v2/https');
const { getFirestore } = require('firebase-admin/firestore');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Caution: New HTTP and HTTP callable functions deployed with any Firebase CLI lower than version 7.7.0 are private by default and throw HTTP 403 errors when invoked. Either explicitly make these functions public or update your Firebase CLI before you deploy any new functions.
// Setting a default region gcloud config set functions/region europe-west1

const admin = require('firebase-admin');
admin.initializeApp();

// ADDFILEs
exports.useraddedfiletodashboard = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const { FieldValue } = require('firebase-admin/firestore');
        const db = getFirestore();

        const objectId = req.query.objectId;
        // const newTitle = req.body.title; // #title textcontent doesnt transfer here for some reason its empty string

        const idToken = req.headers.authorization.split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedIdToken.uid;

        const userDoc = await db.collection('users').doc(uid);
        if (!userDoc) {
          return res.status(404).json({ error: 'User Not found' });
        }

        if (!objectId) {
          return res.status(404).json({ error: 'no title or object' });
        }
        // https://googleapis.dev/nodejs/firestore/latest/FieldValue.html#.arrayUnion

        const file = {
          name: objectId,
          title: objectId,
        };

        const update = userDoc.update({
          storedFiles: FieldValue.arrayUnion(file),
        });

        console.log(update);
        return res
          .status(200)
          .json({ message: 'Added user file', file: objectId });
      } catch (e) {
        return res.status(500).json({ error: 'Error finding file. ' });
      }
    });
  }
);

// REMOVEFILE
exports.userdeletefilefromdashboard = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      const { FieldValue } = require('firebase-admin/firestore');
      const db = getFirestore();

      const objectId = req.query.objectId;

      const idToken = req.headers.authorization.split(' ')[1];
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedIdToken.uid;

      try {
        const userDoc = await db.collection('users').doc(uid);
        if (!userDoc) {
          return res.status(404).json({ error: 'User Not found' });
        }
        // https://googleapis.dev/nodejs/firestore/latest/FieldValue.html#.arrayUnion

        await userDoc.update({
          storedFiles: FieldValue.arrayRemove(objectId),
        });

        return res
          .status(200)
          .json({ message: 'Removed dashboard file', file: objectId });
      } catch (e) {
        return res
          .status(500)
          .json({ err: 'Error deleting file from dashboard' });
      }
    });
  }
);

// check that the only operation has been done is add or is same and not edit/delete
exports.editbucketfile = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      const { Storage } = require('@google-cloud/storage');
      const storage = new Storage();
      const bucket = storage.bucket('linkshare-json');
      const db = getFirestore();

      const objectId = req.query.objectId;

      const info = req.body;

      const idToken = req.headers.authorization.split(' ')[1];
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      const userEmail = decodedIdToken.email;

      try {
        // get the file
        const file = await db
          .collection('files')
          .where('file', '==', objectId)
          .get();

        if (file.empty) {
          return res.status(404).json({ error: 'Doc not found' });
        }

        let rights = false;

        const fileData = file.docs[0].data();

        // if owner enabled update, else if user has edit rights allow update
        // let foundUser;

        const resultsBasedOnRights = (fileData) => {
          const editor = fileData.usersWithRights.some(
            (obj) => obj.hasOwnProperty(userEmail) && obj[userEmail] === 'edit'
          );
          const owner = fileData.usersWithRights.some(
            (obj) => obj.hasOwnProperty(userEmail) && obj[userEmail] === 'owner'
          );

          if (fileData.owners.includes(userEmail) || owner) {
            rights = true;
          } else if (editor) {
            // some rights
            rights = true;
          }

          return rights;
        };

        rights = resultsBasedOnRights(fileData);
        console.log(rights);

        // if owner or edit, change
        if (rights) {
          const file = bucket.file(objectId + '.json');
          const contents = JSON.stringify(info);
          await file.save(contents, { contentType: 'application/json' });
          return res.status(200).json({ message: 'File saved successfully' });
        } else {
          return res.status(404).json({ err: 'No matching user found' });
        }
      } catch (e) {
        console.log(e, 'Cloud Function updatefile Error');
        return res.status(500).json({ err: 'Error updating file on update' });
      }
    });
  }
);

// If user is offline, check if the file is publicly readable
exports.getfilesuser = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      const db = getFirestore();
      const { Storage } = require('@google-cloud/storage');
      const storage = new Storage();
      const bucket = storage.bucket('linkshare-json');
      const objectId = req.query.objectId;

      try {
        const file = await db
          .collection('files')
          .where('file', '==', objectId)
          .get();
        if (file.empty) {
          return res.status(404).json({ err: 'Doc not found' });
        }

        file.forEach(async (doc) => {
          const fileData = doc.data();
          if (fileData.readType === true) {
            const file = bucket.file(objectId + '.json');
            const data = await file.download();
            const linkJson = JSON.parse(data.toString());
            return res.json({ file: linkJson });
          } else {
            return res
              .status(403)
              .json({ err: 'Forbidden, file is not public' });
          }
        });
      } catch (e) {
        return res.status(500).json({ err: 'Error getting user file' });
      }
    });
  }
);

// return object to signed in user along with the permissions for the file (they are validated again based on the request made)
exports.signedinuser = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      const db = getFirestore();
      const { Storage } = require('@google-cloud/storage');
      const storage = new Storage();
      const bucket = storage.bucket('linkshare-json');
      const objectId = req.query.objectId;

      const idToken = req.headers.authorization.split(' ')[1];
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedIdToken.uid;
      const userEmail = decodedIdToken.email;

      try {
        const file = await db
          .collection('files')
          .where('file', '==', objectId)
          .get();

        const user = await db.collection('users').doc(uid).get();

        if (!user) {
          return res.status(404).json({ error: 'User Not found' });
        }

        if (file.empty) {
          return res.status(404).json({ error: 'Doc not found' });
        }

        let fileInfo = null;
        let hasInDash = false;

        const storedFiles = user.data().storedFiles;

        const fileData = file.docs[0].data();

        // weird solution
        storedFiles.some((file) => {
          if (file.name === objectId) {
            hasInDash = true;
            return true; // stop iterating
          }
          return false;
        });

        const resultsBasedOnRights = (fileData) => {
          let info = null;

          const editor = fileData.usersWithRights.some(
            (obj) => obj.hasOwnProperty(userEmail) && obj[userEmail] === 'edit'
          );
          const owner = fileData.usersWithRights.some(
            (obj) => obj.hasOwnProperty(userEmail) && obj[userEmail] === 'owner'
          );

          if (fileData.owners.includes(userEmail) || owner) {
            info = { rights: 'owner', info: fileData }; // owner right = all data
          } else if (editor) {
            // some rights
            const rights = fileData.usersWithRights[userEmail];

            info = { rights: 'edit' }; // only rights fetched
          } else if (fileData.readType === true) {
            // reader
            info = { rights: 'viewer' };
          }
          return info;
        };

        fileInfo = resultsBasedOnRights(fileData);
        console.log(fileInfo);

        if (fileInfo !== null) {
          console.log('something there');
          const file = bucket.file(objectId + '.json');
          const data = await file.download();
          const linkJson = JSON.parse(data.toString());
          return res.status(200).json({ file: linkJson, fileInfo, hasInDash });
        } else {
          return res
            .status(403)
            .json({ err: 'User not allowed to access page' });
        }
      } catch (e) {
        console.error(e);
        return res
          .status(500)
          .json({ err: 'Error finding file user within document' });
      }
    });
  }
);

// If new user signs in, the user is automatically added to the firebase auth system
exports.createuser = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email;
  const displayName = user.displayName;

  const db = await admin.firestore();

  const userRef = db.collection('users').doc(uid);

  return userRef.set({
    email,
    filesWithRights: [], // owner writes to these
    storedFiles: [], // user chosen files to store
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Get the particulars users files for dashboard
exports.getuserfiles = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const db = getFirestore();
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedIdToken.uid;

        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc) {
          return res.status(404).json({ error: 'User documents not found' });
        }

        const storedFiles = userDoc.get('storedFiles');

        return res.status(200).json(storedFiles);
      } catch (e) {
        console.log(e, 'Cloud Function getUserFiles() Error');
        return res
          .status(500)
          .json({ err: 'Error getting user dashboard data' });
      }
    });
  }
);

exports.updatefilerights = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const db = getFirestore();
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        const userEmail = decodedIdToken.email;

        const usersWithRights = req.body;

        const fileName = req.query.objectId;

        const file = await db
          .collection('files')
          .where('file', '==', fileName)
          .get();

        if (!file) return res.status(404).json({ error: 'Document not found' });

        const fileRef = file.docs[0].ref;

        const fileData = file.docs[0].data();

        const owner = fileData.usersWithRights.some(
          (obj) => obj.hasOwnProperty(userEmail) && obj[userEmail] === 'owner'
        );

        // fix if userswithrights included owner the change owner
        if (fileData.owners.includes(userEmail) || owner) {
          await fileRef.update({
            usersWithRights,
          });

          return res.status(200).json({ message: 'File rights updated' });
        } else {
          return res
            .status(404)
            .json({ message: 'Update Not allowed by this user' });
        }
      } catch (e) {
        console.log(e, 'Cloud Function updateFileRights Error');
        return res.status(500).json({ err: 'Error updating file rights' });
      }
    });
  }
);

exports.updateuserfiles = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const db = getFirestore();
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        const files = req.body;
        const uid = decodedIdToken.uid;

        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc) {
          return res.status(404).json({ error: 'User documents not found' });
        }

        await userDoc.ref.update({
          storedFiles: files,
        });

        return res.status(200).json({ message: 'updates user files', files });
      } catch (e) {
        console.log(e, 'Cloud Function updateuserfiles() Error');
        return res.status(500).json({ err: 'Error updating user files' });
      }
    });
  }
);

// set uuid for files
// If new user signs in, the user is automatically added to the firebase auth system
exports.createfile = onRequest(
  { timeoutSeconds: 1200, region: ['europe-west2'] },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const db = getFirestore();
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage();
        const bucket = storage.bucket('linkshare-json');

        const uuid = require('uuid');
        const md5 = require('md5');

        const idToken = req.headers.authorization.split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedIdToken.uid;
        const userEmail = decodedIdToken.email;

        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc) {
          return res.status(404).json({ error: 'User documents not found' });
        }

        // gen unique file name from uuid
        const uniqueNumber = uuid.v4();

        // limit filename to 8 characters
        const fileName = md5('hksd' + uniqueNumber).substring(0, 8);
        const index = parseInt(req.query.index);

        // update the name, which is used as a link to the linkpage stored in user files array, points to new file in files collec
        const storedFiles = userDoc.data().storedFiles;

        console.log(storedFiles, index);

        // of doesnt exist, create it
        if (!isNaN(index) && !storedFiles[index]) {
          storedFiles.splice(index, 0, { name: fileName, title: 'Title' });
          storedFiles[index].name = fileName;
        } else if (isNaN(index)) {
          storedFiles.push({ name: fileName, title: 'Title' });
        }

        // overwrite the stored files to have new file name
        await userDoc.ref.update({
          storedFiles,
        });

        // send to user utilitybar
        const fileInfo = {
          info: {
            file: fileName,
            name: 'Title',
            owners: [userEmail],
            readType: true,
            usersWithRights: [],
          },
          rights: 'owner',
        };

        // info is the file to be sent to file collection,
        // next time user visits dash, the file name (href) should point to this new instance
        await db.collection('files').add(fileInfo.info);

        const linkObject = {
          links: [],
          publicationTime: '',
          title: 'Title',
        };

        const contents = JSON.stringify(linkObject);
        const uploadToBucket = await bucket
          .file(fileName + '.json')
          .save(contents, { contentType: 'application/json' });

        console.log(`${fileName} uploaded to link-share.json`, uploadToBucket);

        return res.status(200).json({
          file: linkObject,
          fileInfo,
          hasInDash: true,
          newName: fileName,
        });
      } catch (e) {
        console.log(e, 'Something Went wrong with creating new file');
        return res.status(500).json({ err: 'Error initiating user file' });
      }
    });
  }
);
