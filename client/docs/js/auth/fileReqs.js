export async function addToDashboard(idToken, objectId, title) {
  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/useraddedfiletodashboard?objectId=${objectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          body: JSON.stringify({ title: title }),
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(`${e}, Error adding to user dashboard`);
  }
}

export async function getStoredFiles(idToken) {
  try {
    const response = await fetch(
      'https://europe-west2-linkshares.cloudfunctions.net/getuserfiles',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { files: data };
  } catch (e) {
    console.log(`${e}, Error adding to user dashboard`);
  }
}

// request bucket with no rights
export async function signedOutRequest(objectId) {
  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/getfilesuser?objectId=${objectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(`${e}, Error fetching file whilst signed out`);
    return { error: 'Page not found' };
  }
}

// request bucket and check rights
export async function signedInRequest(idToken, objectId) {
  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/signedinuser?objectId=${objectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    return { error: 'Page not found' };
  }
}

export async function updateContent(idToken, objectId, links) {
  const header = document.querySelector('#title').textContent;
  const publicationTime = new Date().toLocaleString('en-GB', {
    timeZone: 'UTC',
  });

  const file = {
    title: header,
    links: links,
    publicationTime: publicationTime,
  };

  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/editbucketfile?objectId=${objectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(file),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(`${e}, User not signed in.`);
  }
}

export async function updateFiles(idToken, files) {
  try {
    const response = await fetch(
      'https://europe-west2-linkshares.cloudfunctions.net/updateuserfiles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(files),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(`${e}, User not signed in.`);
  }
}

// @obj usersWithRights
// @boolean document ReadType

export async function updateFileRights(idToken, objectId, postObj) {
  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/updatefilerights?objectId=${objectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(postObj),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(`${e}, User not signed in.`);
  }
}

// getfilerights
export async function getFileRights(idToken, objectId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/linkshares/europe-west2/addtobucketfile?objectId=${objectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rights = await response.json();
    return rights;
  } catch (e) {
    console.log(`${e}, User not signed in.`);
  }
}

export async function initiateNewLinkPage(idToken, title, index) {
  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/createfile?index=${index}&title=${title}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    if (!response.ok) {
      return { error: 'Page not found' };
    }
    const rights = await response.json();
    return rights;
  } catch (e) {
    console.log(`${e}, User not signed in.`);
  }
}

// emailNotification
// @ sendingInfo obj
// @ objectId string
// @ email string
export async function emailNotification(idToken, objectId, sendingInfo) {
  try {
    const response = await fetch(
      `https://europe-west2-linkshares.cloudfunctions.net/emailnotification?objectId=${objectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          body: JSON.stringify(sendingInfo),
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rights = await response.json();
    return rights;
  } catch (e) {
    console.log(`${e}, User not signed in.`);
  }
}
