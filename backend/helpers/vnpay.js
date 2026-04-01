const crypto = require("crypto");

module.exports.createPaymentUrl = (orderId, amount, orderInfo, ipAddr) => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const returnUrl = process.env.VNPAY_RETURN_URL;
  const paymentUrl = process.env.VNPAY_PAYMENT_URL;

  const pad = (n) => String(n).padStart(2, "0");

  // Giờ Việt Nam UTC+7
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const createDate =
    `${now.getUTCFullYear()}` +
    `${pad(now.getUTCMonth() + 1)}` +
    `${pad(now.getUTCDate())}` +
    `${pad(now.getUTCHours())}` +
    `${pad(now.getUTCMinutes())}` +
    `${pad(now.getUTCSeconds())}`;

  // FIX 1: Chuyển IPv6 "::1" thành IPv4 "127.0.0.1"
  const cleanIp =
    ipAddr === "::1" || ipAddr === "::ffff:127.0.0.1"
      ? "127.0.0.1"
      : ipAddr.replace("::ffff:", "");

  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId.toString(),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(amount * 100).toString(),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: cleanIp, // FIX 1: dùng IP đã làm sạch
    vnp_CreateDate: createDate,
  };

  const sortedKeys = Object.keys(params).sort();

  // FIX 2: Khi build signData, encode value - dấu cách thành "+"
  const signData = sortedKeys
    .map(
      (key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`,
    )
    .join("&");

  console.log("signData:", signData);

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Build URL cuối - encode bình thường
  const queryString = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  return `${paymentUrl}?${queryString}&vnp_SecureHash=${signed}`;
};

module.exports.verifyReturnUrl = (query) => {
  const secretKey = process.env.VNPAY_HASH_SECRET;

  const { vnp_SecureHash, vnp_SecureHashType, ...params } = query;

  const sortedKeys = Object.keys(params).sort();

  // Cũng phải encode giống lúc tạo
  const signData = sortedKeys
    .map(
      (key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`,
    )
    .join("&");

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return signed === vnp_SecureHash;
};
