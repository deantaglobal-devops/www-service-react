import { useState } from "react";

import Modal from "../../../../components/Modal/modal";
import RescheduleManual from "./rescheduleManual";
import RescheduleAuto from "./rescheduleAuto";

export default function RescheduleDatesChoose(props) {
  const [chooseType, setChooseType] = useState(1);
  const [modalChoosed, setModalChoosed] = useState(0);
  const [modalChoice, setModalChoice] = useState(true);
  const { closeRescheduleModal } = props;

  return (
    <>
      {modalChoice && (
        <Modal
          displayModal={modalChoice}
          closeModal={() => {
            setModalChoice(false);
            closeRescheduleModal();
          }}
          title="Reschedule Dates"
          content={
            <>
              <p>
                Choose to adjust Milestone and Task dates individually or auto
                reschedule
                <br />
                according to the template
              </p>

              <div className="flex dir-ro p-20">
                <label className="pure-material-radio">
                  <input
                    type="radio"
                    className="project-radio"
                    id="manually"
                    value={1}
                    name="typeReschedule"
                    defaultChecked
                    onChange={(e) => setChooseType(e.target.value)}
                  />
                  <span>Manually Reschedule Dates</span>
                </label>
                <label className="pure-material-radio">
                  <input
                    type="radio"
                    className="project-radio"
                    id="automatically"
                    value={2}
                    name="typeReschedule"
                    onChange={(e) => setChooseType(e.target.value)}
                  />
                  <span>Auto Reschedule Dates</span>
                </label>
              </div>
            </>
          }
          button1Text="Cancel"
          handleButton1Modal={() => {
            setModalChoice(false);
            closeRescheduleModal();
          }}
          Button2Text="Continue"
          handleButton2Modal={() => {
            setModalChoosed(chooseType);
            setModalChoice(false);
          }}
        />
      )}

      <RescheduleManual openModal={parseInt(modalChoosed) === 1} {...props} />
      <RescheduleAuto openModal={parseInt(modalChoosed) === 2} {...props} />
    </>
  );
}
