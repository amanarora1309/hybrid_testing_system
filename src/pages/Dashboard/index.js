import React, { useEffect } from "react"

import { connect } from "react-redux";
import {
  Row,
  Col,
} from "reactstrap"

// Pages Components
import Miniwidget from "./Miniwidget"
import MonthlyEarnings from "./montly-earnings";
import EmailSent from "./email-sent";
import MonthlyEarnings2 from "./montly-earnings2";
import Inbox from "./inbox";
import RecentActivity from "./recent-activity";
import WidgetUser from "./widget-user";
import YearlySales from "./yearly-sales";
import LatestTransactions from "./latest-transactions";
import LatestOrders from "./latest-orders";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { updateToken } from "helpers/api_helper";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Dashboard = (props) => {

  document.title = "Dashboard | IOS Admin Dashboard";


  const breadcrumbItems = [
    { title: "IOS", link: "#" },
    { title: "Dashboard", link: "#" }
  ]
  const query = useQuery();
  useEffect(() => {
    props.setBreadcrumbItems('Dashboard', breadcrumbItems)
  },)



  useEffect(() => {
    updateToken();
  }, []);



  const reports = [
    { title: "Questions in QB", iconClass: "cube-outline", total: "1200", average: "+11%", badgecolor: "info", navigateLink: "/all-questions" },
    { title: "School Register", iconClass: "buffer", total: "5", average: "+29%", badgecolor: "info", navigateLink: "/all-school" },
    { title: "School Sitting Capacity", iconClass: "tag-text-outline", total: "4500", average: "0%", badgecolor: "info", navigateLink: "/dashboard" },
    { title: "Student Registered", iconClass: "briefcase-check", total: "1000", average: "+89%", badgecolor: "info", navigateLink: "/dashboard" },
  ]

  return (
    <React.Fragment>

      {/*mimi widgets */}
      <Miniwidget reports={reports} />

      <Row>
        <Col xl="3">
          {/* Monthly Earnings */}
          <MonthlyEarnings />
        </Col>

        <Col xl="6">
          {/* Email sent */}
          <EmailSent />
        </Col>

        <Col xl="3">
          <MonthlyEarnings2 />
        </Col>

      </Row>


    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);


// <Row>

// <Col xl="4" lg="6">
//   {/* inbox */}
//   <Inbox />
// </Col>
// <Col xl="4" lg="6">
//   {/* recent activity */}
//   <RecentActivity />

// </Col>
// <Col xl="4">
//   {/* widget user */}
//   <WidgetUser />

//   {/* yearly sales */}
//   <YearlySales />
// </Col>
// </Row>

// <Row>
// <Col xl="6">
//   {/* latest transactions */}
//   <LatestTransactions />
// </Col>

// <Col xl="6">
//   {/* latest orders */}
//   <LatestOrders />
// </Col>
// </Row>