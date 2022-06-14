const DashboardCard = ({ title, value, subtitle, theme, customClass='col-md-6 mb-4'}) => {
  return (
    <div className={`${customClass} stretch-card transparent`}>
      <div className={"card " + theme}>
        <div className="card-body">
          <div className="mb-4">{title}</div>
          <div className="fs-30 mb-2 whitelist-value">{value}</div>
          <div>{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard;