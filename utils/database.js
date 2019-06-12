module.exports = (persistence = {}) => {
  let loanLimit = 1000;
  const findByEmail = async email =>
    await new Promise(resolve => resolve(persistence[email]));
  const setByEmail = async (email, amount) =>
    new Promise(resolve => {
      persistence[email] = amount;
      resolve(persistence);
    });

  return {
    findByEmail,
    setByEmail,
  };
};
