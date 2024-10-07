const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("authJwtToken")!); // Store user data after login

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>User: {JSON.stringify(user)}</p>
    </div>
  );
};

export default Dashboard;
