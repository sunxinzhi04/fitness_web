// script.js

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("evalBtn").addEventListener("click", evaluate);
  document.getElementById("parqBtn").addEventListener("click", () => {
    document.getElementById("parqModal").classList.remove("hidden");
  });
});

function closeParq() {
  document.getElementById("parqModal").classList.add("hidden");
}

function submitParq() {
  let score = 0;
  for (let i = 1; i <= 7; i++) {
    if (document.getElementById("q" + i).value === "是") score++;
  }
  closeParq();
  window.parqRiskLevel = score >= 3 ? '高风险' : score >= 1 ? '中风险' : '低风险';
  alert("问卷提交成功，您的风险等级为：" + window.parqRiskLevel);
}

function evaluate() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseInt(document.getElementById("age").value);
  const injury = document.getElementById("injury").value;
  const demand = document.getElementById("demand").value;

  if (!height || !weight || !age) {
    alert("请填写完整信息");
    return;
  }

  const stdWeight = (height - 100) * 0.9;
  const diff = weight - stdWeight;
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

  let bmiScore = 0;
  if (bmi < 18.5) bmiScore = 60;
  else if (bmi < 24.9) bmiScore = 90;
  else if (bmi < 29.9) bmiScore = 70;
  else bmiScore = 50;

  let parqScore = window.parqRiskLevel === '高风险' ? 40 : window.parqRiskLevel === '中风险' ? 70 : 90;
  if (!window.parqRiskLevel) parqScore = 80;

  const healthScore = Math.round((bmiScore + parqScore) / 2);
  document.getElementById("score").innerText = healthScore;

  // 构建评估内容
  const report = document.getElementById("report");
  report.innerHTML = `
    <section>
      <h2 class="text-xl font-bold mb-2 text-cyan-400">📈 BMI 与体重对比图</h2>
      <div id="chart" class="h-60"></div>
    </section>
    <section>
      <h2 class="text-xl font-bold mt-6 mb-2 text-cyan-400">🧠 身体状态分析</h2>
      <p>BMI 值：<span class="text-yellow-400">${bmi}</span>，标准体重为 <span class="text-blue-400">${stdWeight.toFixed(1)} kg</span>，当前体重偏差为 <span class="text-red-400">${diff.toFixed(1)} kg</span>。</p>
    </section>
    <section>
      <h2 class="text-xl font-bold mt-6 mb-2 text-cyan-400">🥗 饮食建议</h2>
      <p>${generateDietSuggestion(bmi)}</p>
    </section>
    <section>
      <h2 class="text-xl font-bold mt-6 mb-2 text-cyan-400">🏋️ 健身建议（目标：${demand}）</h2>
      <p>${generatePlanByDemand(demand)}</p>
    </section>
    <section>
      <h2 class="text-xl font-bold mt-6 mb-2 text-cyan-400">⚠️ 风险评估等级</h2>
      <p>${window.parqRiskLevel || "未填写问卷，默认中等风险。"}</p>
    </section>
  `;

  drawChart(stdWeight, weight);
}

function drawChart(std, real) {
  const chart = echarts.init(document.getElementById("chart"));
  const option = {
    backgroundColor: "transparent",
    xAxis: {
      type: 'category',
      data: ['标准体重', '当前体重'],
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#fff' }
    },
    series: [{
      type: 'bar',
      data: [std, real],
      itemStyle: {
        color: (params) => params.dataIndex === 0 ? '#60a5fa' : '#f87171'
      }
    }]
  };
  chart.setOption(option);
}

function generateDietSuggestion(bmi) {
  if (bmi < 18.5) return "建议增加蛋白质摄入（鸡蛋、瘦肉、牛奶），每日至少摄入1.5g/kg体重的蛋白质，同时确保足够热量，避免空腹运动。";
  if (bmi < 24.9) return "当前体重适中，建议均衡摄入碳水、蛋白、脂肪，避免高糖高盐饮食，规律三餐。";
  if (bmi < 29.9) return "建议适当减少碳水摄入（精米面），增加蔬菜水果，控制油脂，避免饮料和夜宵。";
  return "建议制定系统化减脂饮食计划，采用地中海饮食、控糖饮食或间歇性断食，并监控每周体重变化。";
}

function generatePlanByDemand(demand) {
  const plans = {
    "增肌": `建议每周进行 4-5 次抗阻训练（如哑铃推举、深蹲、硬拉），每组 6-12 次，训练后摄入优质蛋白如乳清、牛肉。配合睡眠 ≥7小时。`,
    "减脂": `建议每周 3-4 次中等强度有氧运动（快走、慢跑、跳绳），配合低脂饮食，每日控制热量在基础代谢 +300以内。`,
    "塑型": `建议混合训练：抗阻 + 有氧（交替进行），并结合核心训练（平板支撑、俄罗斯转体）塑造线条感。`,
    "健康": `建议每周运动 ≥3次，每次 30 分钟以上（快步走、骑车、太极拳），注重拉伸与稳定性，预防伤病。`
  };
  return plans[demand] || "选择运动目标后会显示个性化训练方案。";
}
