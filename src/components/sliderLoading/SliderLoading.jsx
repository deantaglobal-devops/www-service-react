import React from 'react';

const SliderLoading = (props) => {
  return (
    <>
      <div
        id="loading-wrapper"
        className={`loading-slider ${props.fitLoad ? `load-fit` : `load-min`}`}
      >
        <div className="loader">
          <div className="brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{
                margin: 'auto',
                background: 'none',
                display: 'block',
                shapeRendering: 'auto',
              }}
              width="80px"
              height="80px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <g transform="translate(80,50)">
                <g transform="rotate(0)">
                  <circle cx="0" cy="0" r="3" fill="#074973" fillOpacity="1">
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.9090909090909091s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.9090909090909091s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(75.23760598493544,66.21922452366792)">
                <g transform="rotate(32.72727272727273)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.9090909090909091"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.8181818181818182s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.8181818181818182s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(62.462450390056595,77.28895986063554)">
                <g transform="rotate(65.45454545454545)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.8181818181818182"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.7272727272727273s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.7272727272727273s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(45.73055485180145,79.69464325642798)">
                <g transform="rotate(98.18181818181817)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.7272727272727273"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.6363636363636364s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.6363636363636364s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(30.35417798164145,72.67248723062775)">
                <g transform="rotate(130.9090909090909)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.6363636363636364"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.5454545454545454s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.5454545454545454s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(21.215210791565077,58.45197670524289)">
                <g transform="rotate(163.63636363636365)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.5454545454545454"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.45454545454545453s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.45454545454545453s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(21.215210791565077,41.548023294757115)">
                <g transform="rotate(196.36363636363635)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.45454545454545453"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.36363636363636365s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.36363636363636365s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(30.354177981641442,27.327512769372255)">
                <g transform="rotate(229.0909090909091)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.36363636363636365"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.2727272727272727s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.2727272727272727s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(45.73055485180144,20.30535674357202)">
                <g transform="rotate(261.8181818181818)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.2727272727272727"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.18181818181818182s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.18181818181818182s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(62.46245039005658,22.711040139364442)">
                <g transform="rotate(294.54545454545456)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.18181818181818182"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="-0.09090909090909091s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="-0.09090909090909091s"
                    ></animate>
                  </circle>
                </g>
              </g>
              <g transform="translate(75.23760598493544,33.78077547633208)">
                <g transform="rotate(327.2727272727273)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#074973"
                    fillOpacity="0.09090909090909091"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      begin="0s"
                      values="1.5 1.5;1 1"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                    ></animateTransform>
                    <animate
                      attributeName="fill-opacity"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      values="1;0"
                      begin="0s"
                    ></animate>
                  </circle>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderLoading;
