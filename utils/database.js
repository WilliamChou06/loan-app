module.exports = (persistence = {}) => {
  const findByEmail = async email =>
    await new Promise(resolve => resolve(persistence[email]));
  const setByEmail = async (email, amount) =>
    new Promise(resolve => {
      persistence[email] = amount;
      resolve(persistence);
    });

  const getCurrentLoanAmount = async () =>
    new Promise(resolve => {
      let loanCount = 0;
      let users = Object.entries(persistence);
      users.forEach(user => (loanCount = loanCount + user[1]));
      resolve(loanCount);
    });

  return {
    findByEmail,
    setByEmail,
    getCurrentLoanAmount,
  };
};
