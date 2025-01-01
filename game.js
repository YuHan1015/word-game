// 玩家数据
let player = {
  境界: "炼气一层",
  经验: 0,
  灵石: 10,
};

// 境界列表
const 境界列表 = ["炼气", "筑基", "金丹", "元婴", "化神", "大乘", "渡劫"];

// 随机事件
function 随机事件() {
  const events = [
    { 描述: "击杀低阶妖兽，获得灵石！", 灵石: 5, 经验: 10 },
    { 描述: "与修士切磋，稍有收获！", 灵石: -3, 经验: 5 },
    { 描述: "发现灵草，卖出赚得灵石！", 灵石: 20, 经验: 15 },
    { 描述: "遭遇妖兽，狼狈逃脱。", 灵石: -10, 经验: -5 },
  ];
  return events[Math.floor(Math.random() * events.length)];
}

// 更新界面
function 更新界面() {
  document.getElementById("境界").innerText = player.境界;
  document.getElementById("经验").innerText = player.经验;
  document.getElementById("灵石").innerText = player.灵石;
}

// 闭关修炼
function 闭关修炼() {
  输出信息("你闭关修炼了一段时间，获得了经验。");
  player.经验 += 20;
  检查突破();
  更新界面();
}

// 外出历练
function 外出历练() {
  const event = 随机事件();
  输出信息(`事件：${event.描述}`);
  player.灵石 += event.灵石;
  player.经验 += event.经验;
  检查突破();
  更新界面();
}

// 查看属性
function 查看属性() {
  输出信息(
    `境界: ${player.境界}<br>经验: ${player.经验}<br>灵石: ${player.灵石}`
  );
}

// 检查突破
function 检查突破() {
  if (player.经验 >= 100) {
    const 当前境界 = 境界列表.indexOf(player.境界.split("一")[0]);
    if (当前境界 < 境界列表.length - 1) {
      player.境界 = 境界列表[当前境界 + 1] + "一层";
      player.经验 -= 100;
      输出信息(`恭喜你突破到 ${player.境界}！`);
    } else {
      输出信息("你已达成最高境界，准备飞升吧！");
    }
  }
}

// 输出信息
function 输出信息(message) {
  const output = document.getElementById("output");
  output.innerHTML += `<p>${message}</p>`;
  output.scrollTop = output.scrollHeight; // 滚动到底部
}
