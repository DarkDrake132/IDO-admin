import { useEffect, useState } from "react";
import DashboardCard from "../components/ui/DashboardCard/DashboardCard";

import poolAPI from "../apis/project";
import appliedProjectAPI from "../apis/appliedProject"

const DEFAULT_DAYS = 30;

function Home() {
  const [totalPoolInfo, setTotalPoolInfo] = useState({
    total: 0,
    current: 0,
    percent: 0,
  });
  const [totalAppliedProjectInfo, setTotalAppliedProjectInfo] = useState({
    total: 0,
    current: 0,
    percent: 0,
  });
  const fetchTotalPoolInfo = async (days) => {
    try {
      const res = await poolAPI.getTotalPoolInfo({ days: days })
      return res.pools;
    } catch (err) {
      console.log("fetch total pool info err: ", err);
      return false;
    }
  }
  const fetchTotalAppliedProjectInfo = async (days) => {
    try {
      const res = await appliedProjectAPI.getTotalAppliedProjectInfo({ days: days })
      console.log('res: ', res);
      return res.projects;
    } catch (err) {
      console.log("fetch total pool info err: ", err);
      return false;
    }
  }

  useEffect(()=> {
    const getDashboardInfo = async () => {
      const poolInfo = await fetchTotalPoolInfo(DEFAULT_DAYS);
      setTotalPoolInfo({
        total: poolInfo.total,
        current: poolInfo.numberOfPools,
        percent: poolInfo.percent
      })

      const appliedProjectInfo = await fetchTotalAppliedProjectInfo(DEFAULT_DAYS);
      setTotalAppliedProjectInfo({
        total: appliedProjectInfo.total,
        current: appliedProjectInfo.numberOfProjects,
        percent: appliedProjectInfo.percent
      })
    }
    getDashboardInfo();
  },[])
  return (
    <div className="row">
      <div className="col-md-12 grid-margin">
        {/* greetings */}
        <div className="row mb-4">
          <div className="col-12 col-xl-8 mb-4 mb-xl-0">
            <h3 className="font-weight-bold">Welcome Admin</h3>
            <h6 className="font-weight-normal mb-0">All systems are running smoothly!</h6>
          </div>
        </div>

        {/* banner */}
        <div className="row">
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card tale-bg">
                <div className="card-people mt-auto">
                  <img src="statics/images/dashboard/people.svg" alt="people"/>
                  
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin transparent">
              <div className="row">
                <DashboardCard
                  title="Total Pools"
                  value={totalPoolInfo.total}
                  theme="card-tale"
                />
                <DashboardCard
                  title={`Pools in ${DEFAULT_DAYS} days`}
                  value={totalPoolInfo.current}
                  subtitle={`${totalPoolInfo.percent} (${DEFAULT_DAYS} days)`}
                  theme="card-inverse-info"
                />
                <DashboardCard
                  title="Total Applied Project"
                  value={totalAppliedProjectInfo.total}
                  theme="card-light-blue"
                />
                <DashboardCard
                  title={`Applied Projects in ${DEFAULT_DAYS} days`}
                  value={totalAppliedProjectInfo.current}
                  subtitle={`${totalAppliedProjectInfo.percent} (${DEFAULT_DAYS} days)`}
                  theme="card-inverse-primary"
                />
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Home;
