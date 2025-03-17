import * as core from "@actions/core";
import axios from "axios";
import * as qs from "querystring";

(async () => {
  // Validate parameters
  const [productId, scheduleId, seatId] = [
    "product-id",
    "schedule-id",
    "seat-id",
  ].map((name) => {
    const value = core.getInput(name);
    if (!value) {
      throw new Error(`melon-ticket-actions: Please set ${name} input parameter`);
    }
    return value;
  });

  const message = core.getInput("message") ?? "티켓사세요";

  const res = await axios({
    method: "POST",
    url: "https://ticket.melon.com/tktapi/product/seatStateInfo.json",
    params: {
      v: "1",
    },
    data: qs.stringify({
      prodId: productId,
      scheduleNo: scheduleId,
      seatId,
      volume: 1,
      selectedGradeVolume: 1,
    }),
  });

  console.log("Got response: ", res.data);

  if (res.data.chkResult) {
    const link = `http://ticket.melon.com/performance/index.htm?${qs.stringify({
      prodId: productId,
    })}`;
    console.log(`${message} ${link}`);
  }
})().catch((e) => {
  console.error(e.stack);
  core.setFailed(e.message);
});
