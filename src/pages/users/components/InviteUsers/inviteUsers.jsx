import InviteNewUserForm from "../../../../components/inviteNewUserForm";

export default function InviteUsers(props) {
  return (
    <div className="popover fade bs-popover-right show with-scroll">
      <div className="arrow" />
      <div className="popover-header">
        <h3 className="title-popover">Invite Users</h3>
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={() => props?.closeModal()}
        >
          <i className="material-icons">close</i>
        </button>
      </div>

      <div className="popover-body" id="popover-body">
        <InviteNewUserForm
          userId={props?.userId}
          projectId={props?.projectId}
          client={props?.client}
          clientId={props.clientId}
          companyId={props.companyId}
          hideHeader
          showFailToast={props.showFailToast}
          showWarningToast={props.showWarningToast}
        />
      </div>
    </div>
  );
}
