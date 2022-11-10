const getWords = async (req, res) => {
  const order = await Order.getOrder(userId);
  res.send({ order });
  return;
};
