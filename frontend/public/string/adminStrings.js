const strings = {
  companyName: "Summarizer",
  dashboard: "Dashboard",
  app: "App",
  logout: "Logout",
  adminDashboard: "Admin Dashboard",
  apiStatistics: "API Statistics",
  apiStatisticsDescription: "A list of all the routes and its Statistics",
  apiStatEndPoint: "End Point",
  apiStatMethod: "Method",
  apiStatRequests: "Requests",
  apiStatLastAccessed: "Last Accessed",
  userStatistics: "User Statistics",
  userStatisticsDescription: "A list of all the users and its statistics",
  editModalUsername: "Username",
  editModalEmail: "Email",
  editModalTotalRequest: "Total Request",
  editModalRequestLimit: "Request Limit",
  editModalMaxApiCount: "Max API Count",
  editModalSubmitEdit: "Submit Edit",
  editModalDelete: "Delete",
  editModalCancel: "Cancel",
};

document.getElementById("adminDashboard").innerText = strings.adminDashboard;
document.getElementById("apiStatistics").innerText = strings.apiStatistics;
document.getElementById("apiStatisticsDescription").innerText =
  strings.apiStatisticsDescription;
document.getElementById("apiStatEndPoint").innerText = strings.apiStatEndPoint;
document.getElementById("apiStatMethod").innerText = strings.apiStatMethod;
document.getElementById("apiStatRequests").innerText = strings.apiStatRequests;
document.getElementById("apiStatLastAccessed").innerText =
  strings.apiStatLastAccessed;

document.getElementById("userStatistics").innerText = strings.userStatistics;
document.getElementById("userStatisticsDescription").innerText =
  strings.userStatisticsDescription;
document.getElementById("editModalUsername").innerText =
  strings.editModalUsername;
document.getElementById("editModalEmail").innerText = strings.editModalEmail;

document.getElementById("editModalTotalRequest").innerText =
  strings.editModalTotalRequest;

document.getElementById("editModalRequestLimit").innerText =
  strings.editModalRequestLimit;

document.getElementById("popupUserName").innerText = strings.editModalUsername;
document.getElementById("popupEmail").innerText = strings.editModalEmail;
document.getElementById("popupMaxCount").innerText =
  strings.editModalMaxApiCount;
document.getElementById("editSubmit").innerText = strings.editModalSubmitEdit;
document.getElementById("deleteSubmit").innerText = strings.editModalDelete;
document.getElementById("editCancel").innerText = strings.editModalCancel;

