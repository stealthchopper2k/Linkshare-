export default function LogBtn({ string, func }) {
  return (
    <button
      onClick={() => {
        func();
      }}
      style={{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifySelf: 'center',
      }}
    >
      {string}
    </button>
  );
}
