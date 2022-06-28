import ModalForm from "../../../../components/ModalForm/modalForm";

export default function SpecialInstructionsTaskModal({
  openSpecialInstructionsTaskModal,
  handleOnCloseSpecialInstructionsTaskModal,
  data,
  projectSpecialInstruction,
  specialInstructions,
}) {
  return (
    <ModalForm show={openSpecialInstructionsTaskModal}>
      <div className="general-forms">
        <div className="modal-header">
          <h5 className="modal-title">
            {specialInstructions ? (
              <>
                Special Instructions for {projectSpecialInstruction.task_name}
              </>
            ) : (
              <>Checklist Summary for {projectSpecialInstruction.task_name}</>
            )}
          </h5>
          <button
            type="button"
            className="close"
            onClick={() => handleOnCloseSpecialInstructionsTaskModal()}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        <div className="modal-body">
          {specialInstructions ? (
            <p>
              Ensure you've consulted the Special Instructions below before
              marking this task as finished.
            </p>
          ) : (
            <p>
              Ensure you've consulted the checklist below before marking this
              task as finished.
            </p>
          )}

          <ul className="si-ch si">
            {data?.map((specialInstruction) => (
              <li
                className={`si-ch-item-${specialInstruction.task_id}`}
                key={specialInstruction.checklist_id}
              >
                <span>
                  {specialInstruction.checklist_name
                    ? specialInstruction.checklist_name
                    : specialInstruction.checklist_name_neg}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer cta-right">
          <button
            type="button"
            className="btn btn-outline-primary"
            data-dismiss="modal"
            onClick={() => handleOnCloseSpecialInstructionsTaskModal()}
          >
            {specialInstructions ? (
              <>Close Special Instructions</>
            ) : (
              <>Close Checklist</>
            )}
          </button>
        </div>
      </div>
    </ModalForm>
  );
}
