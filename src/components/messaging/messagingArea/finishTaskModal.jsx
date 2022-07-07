export default function FinishTaskModal({ finish, close, send }) {
  return (
    <>
      <button
        className="deanta-button deanta-button-outlined w-100 mb-3 mt-4 ml-0"
        onClick={() => {
          finish();
          send();
          close();
        }}
      >
        Send and Finish Task
      </button>
      <button
        className="deanta-button deanta-button-outlined w-100 mb-3 ml-0"
        onClick={() => {
          send();
          close();
        }}
      >
        Send and Don’t Finish Task
      </button>
      <button
        className="deanta-button deanta-button-outlined w-100 ml-0"
        onClick={() => close()}
      >
        Cancel
      </button>
    </>
  );
}
