window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("evalBtn").addEventListener("click", evaluate);
  document.getElementById("parqBtn").addEventListener("click", () => {
    document.getElementById("parqModal").classList.remove("hidden");
    renderParqQuestions();
  });
  document.getElementById("exportPdfBtn")?.addEventListener("click", exportPDF);

  // ✅ 确保粒子动画在 DOM 完成后初始化
particlesJS("particles-js", {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: "#6b7280" }, // 改成深灰，明显
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 120,
      color: "#94a3b8", // 线也改成灰蓝色
      opacity: 0.5,
      width: 1
    },
    move: { enable: true, speed: 1.6 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      grab: { distance: 200 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});

});


function exportPDF() {
  const chart1 = document.getElementById("bmiChart");
  const chart2 = document.getElementById("whrChart");
  if (chartInstance1 && chartInstance2) {
    chart1.innerHTML = `<img src="${chartInstance1.getDataURL({ type: 'jpeg', pixelRatio: 2 })}" style="width:100%; height:auto;" />`;
    chart2.innerHTML = `<img src="${chartInstance2.getDataURL({ type: 'jpeg', pixelRatio: 2 })}" style="width:100%; height:auto;" />`;
  }
  const reportEl = document.getElementById("report");
  const opt = {
    margin: 0.5,
    filename: `健康评估报告_${new Date().toLocaleDateString()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(reportEl).save();
}

function closeParq() {
  document.getElementById("parqModal").classList.add("hidden");
}

// 添加缺失的 generateBodyStatus 函数
function generateBodyStatus(bmi, whr, stdWeight, actualWeight) {
  let result = `<p class="text-gray-800">📏 BMI 指数：<span class="text-yellow-500 font-semibold">${bmi}</span>，理想体重：<span class="text-blue-500">${stdWeight.toFixed(1)} kg</span>，当前体重：<span class="text-red-500">${actualWeight} kg</span>。</p>`;
  if (whr) result += `<p class="text-gray-800">📐 腰臀比（WHR）：<span class="text-purple-600 font-semibold">${whr}</span></p>`;

  // BMI 分析
  if (bmi < 18.5) {
    result += `<p class="text-gray-800">⚠️ 您属于【体重过轻】类别，说明可能存在能量摄入不足或肌肉量偏低的问题。这类体型人群免疫力易下降，女性易出现内分泌紊乱、男性则可能伴有骨质流失风险。建议增加摄入高质量蛋白（如鸡蛋、鱼、乳制品）与复合碳水（糙米、红薯），并进行系统化的阻力训练。</p>`;
  } else if (bmi < 24.9) {
    result += `<p class="text-gray-800">✅ 您的体重处于【正常范围】，代表当前营养状态与基础代谢较为平衡。但需注意 BMI 无法评估体脂比例，因此建议配合体脂测量工具观察体成分，预防“隐性肥胖”或肌肉流失。</p>`;
  } else if (bmi < 29.9) {
    result += `<p class="text-gray-800">⚠️ 您处于【超重】状态，虽然未达到肥胖标准，但说明体脂含量已超出理想范围。此阶段可能伴随腹部脂肪堆积、高血脂、血压轻度升高。建议优化晚餐结构、减少久坐时间，并每周保持 ≥3 次中等强度运动。</p>`;
  } else {
    result += `<p class="text-gray-800">🚨 您已进入【肥胖】等级，可能已伴随较明显的脂肪堆积与慢性疾病风险（如高血压、糖尿病、脂肪肝）。BMI 越高，健康负担越大。此类人群建议立刻开始个性化减脂计划，配合营养控制和专业训练，必要时咨询营养师与医生。</p>`;
  }

  // WHR 分析
  if (whr) {
    if (whr < 0.8) {
      result += `<p class="text-gray-800">✅ 腰臀比显示【非常理想】（<0.8），通常代表核心肌群稳定、内脏脂肪偏低，属于健康体态。建议保持核心训练（如平板支撑、卷腹）以维护姿态与脊柱稳定。</p>`;
    } else if (whr < 0.9) {
      result += `<p class="text-gray-800">🟡 腰臀比在【正常范围】（0.8~0.9），说明暂时无明显代谢风险。但仍需关注腰围变化，如经常熬夜、饮食偏油，可能导致腰围缓慢上升。</p>`;
    } else if (whr < 1.0) {
      result += `<p class="text-gray-800">⚠️ 腰臀比【略高】（0.9~1.0），暗示可能开始出现内脏脂肪堆积，尤其是腹型肥胖的早期信号。建议增加腹部拉伸与高强度有氧（如跳绳、爬楼梯）来改善。</p>`;
    } else {
      result += `<p class="text-gray-800">🚨 腰臀比【过高】（>1.0），代表存在腹型肥胖或脂肪集中在躯干部位。该类型与代谢综合征、心脑血管疾病发病风险密切相关。建议立即执行为期 8-12 周的减脂干预计划，并记录腰围变化趋势。</p>`;
    }
  }

  return result;
}

let chartInstance = null;

// 添加 generateDietSuggestion 函数
function generateDietSuggestion(bmi) {
  if (bmi < 18.5) {
    return `📉 您的 BMI 显示体重偏轻，说明当前热量摄入不足或营养结构不均衡。建议：
    <ul class="list-disc pl-5 text-gray-800">
      <li>每日摄入 1.5~2 倍体重（kg）克数的高质量蛋白质，例如鸡蛋、牛奶、鱼类、豆制品。</li>
      <li>主食以复合碳水为主，如糙米、红薯、燕麦，适当摄入植物油（橄榄油、亚麻籽油）。</li>
      <li>确保三餐规律，避免空腹运动，适当增加加餐（坚果、奶昔）。</li>
      <li>结合力量训练促进肌肉增长，改善基础代谢。</li>
    </ul>`;
  }
  if (bmi < 24.9) {
    return `✅ 您的 BMI 处于理想范围，饮食建议以维持代谢与控制体脂为目标：
    <ul class="list-disc pl-5 text-gray-800">
      <li>三大营养素建议分配：碳水 45~55%、蛋白 25~30%、脂肪 15~20%。</li>
      <li>保持一日三餐规律，可根据作息适当实践 8:16 间歇性断食。</li>
      <li>多选择原型食物，如鸡胸肉、杂粮饭、蔬菜沙拉，减少外卖频率。</li>
      <li>水摄入每日 ≥1500ml，促进代谢与肠道蠕动。</li>
    </ul>`;
  }
  if (bmi < 29.9) {
    return `🟡 您的 BMI 显示为超重，建议构建温和可持续的减脂饮食结构：
    <ul class="list-disc pl-5 text-gray-800">
      <li>计算自身 TDEE（总消耗热量），每日摄入热量建议控制在 TDEE 的 80~90%。</li>
      <li>主食中替换部分白米为糙米、藜麦或红薯，控制主食总量。</li>
      <li>增加蔬菜比例至每餐 1/2，摄入足够膳食纤维。</li>
      <li>减少饮料、酒精、甜品和高油炒菜的频率。</li>
    </ul>`;
  }
  return `🚨 您的 BMI 显示为肥胖，需重点控制热量摄入与饮食结构。建议采用地中海饮食或控糖饮食原则：
  <ul class="list-disc pl-5 text-gray-800">
    <li>主食以粗粮为主（全麦面包、燕麦、藜麦），避免精制米面、糕点。</li>
    <li>增加富含不饱和脂肪酸的食物，如橄榄油、牛油果、坚果，限制动物油脂。</li>
    <li>每天蔬果摄入 400~500g，选择多样颜色和种类。</li>
    <li>每周至少三次记录饮食（如使用 Keep、薄荷健康），以便追踪热量与营养结构。</li>
    <li>必要时咨询注册营养师进行营养干预或搭配代餐餐单。</li>
  </ul>`;
}

// 添加 generatePlanByDemand 函数
function generatePlanByDemand(demand) {
  const plans = {
    "增肌": `💪 【增肌计划】目标是增加肌肉体积与力量，需在热量盈余下系统训练。
    <ul class="list-disc pl-5 text-gray-800">
      <li>每周进行 4-6 次抗阻训练，建议分部位安排（如胸-背-腿-肩），保持训练强度逐周递增。</li>
      <li>注重多关节复合动作（深蹲、硬拉、卧推）与孤立动作结合。</li>
      <li>训练后 30 分钟内摄入蛋白质（如乳清蛋白+香蕉），提升合成效率。</li>
      <li>保证充足睡眠（7-8 小时）与热量盈余，每日多摄入 300~500 大卡。</li>
      <li>定期测量围度（臂围、大腿围）与体重变化，调整计划。</li>
    </ul>`,

    "减脂": `🔥 【减脂计划】关键在于形成热量赤字并保护肌肉量。
    <ul class="list-disc pl-5 text-gray-800">
      <li>每周进行 3-5 次有氧训练（快走 30-45 分钟、有氧操、游泳或 HIIT）。</li>
      <li>每周安排 2-3 次抗阻训练，重点锻炼大肌群以维持肌肉质量。</li>
      <li>饮食减少高糖、高油、高盐摄入，控制精制主食与夜宵频率。</li>
      <li>记录每日饮食热量，推荐使用 app（如薄荷健康）监测摄入。</li>
      <li>保持足够饮水（≥2000ml），预防虚假饥饿。</li>
    </ul>`,

    "塑型": `✨ 【塑形计划】目标为肌肉线条清晰+低体脂，需精细训练与饮食管理。
    <ul class="list-disc pl-5 text-gray-800">
      <li>每周进行 3 次抗阻训练（偏中高次数，8-15 次/组），注重姿态控制与肌肉感受。</li>
      <li>结合 2 次中等强度有氧训练（慢跑、有氧操），提升脂肪代谢效率。</li>
      <li>建议添加 1 次核心训练/普拉提/瑜伽课，以改善体态与柔韧性。</li>
      <li>饮食结构建议：高蛋白（1.5g/kg 以上）、中碳水、低脂肪。</li>
      <li>每日 7 小时以上高质量睡眠，维持皮质醇稳定。</li>
    </ul>`,

    "健康": `🧘 【健康促进计划】适用于日常缺乏运动、代谢下降或生活习惯不佳者。
    <ul class="list-disc pl-5 text-gray-800">
      <li>每周进行 3 次基础有氧运动（快走、慢骑车、游泳 30 分钟以上）。</li>
      <li>配合每周 1-2 次轻度徒手力量训练（如深蹲、俯卧撑、平板支撑）。</li>
      <li>注重体态调节与生活方式干预，如午休散步、改善久坐、限制高糖高盐食物。</li>
      <li>饮食建议多样化，多摄入蔬果和膳食纤维，减少外卖和加工食品频率。</li>
      <li>建议每季度进行一次体检或指标检测，早期发现健康隐患。</li>
    </ul>`
  };

  return plans[demand] || "请选择具体目标后，将显示个性化训练方案。";
}
function renderParqQuestions() {
  const container = document.getElementById("parqQuestions");
  const questions = [
    "您的医生告诉过你有心脏病或高血压吗？",
    "在休息或活动中是否有胸痛？",
    "过去12个月是否曾头晕、失去平衡或晕厥？",
    "是否患有除心脏病以外的慢性病？",
    "是否正在服用处方的慢性病药物？",
    "是否有关节/骨骼/软组织疾病影响运动？",
    "医生是否建议仅在监督下运动？"
  ];
  container.innerHTML = questions.map((q, i) => `
    <div>
      <label class="block mb-1 text-sm">${i + 1}. ${q}</label>
      <div class="flex gap-4">
        <label><input type="radio" name="q${i + 1}" value="是" class="mr-1">是</label>
        <label><input type="radio" name="q${i + 1}" value="否" class="mr-1">否</label>
      </div>
    </div>
  `).join("");
}

function submitParq() {
  let score = 0;
  for (let i = 1; i <= 7; i++) {
    const val = document.querySelector(`input[name=q${i}]:checked`);
    if (!val) {
      alert(`请回答第 ${i} 题`);
      return;
    }
    if (val.value === "是") score++;
  }
  closeParq();
  window.parqRiskLevel = score >= 3 ? '高风险' : score >= 1 ? '中风险' : '低风险';
  document.getElementById("parqStatus").classList.remove("hidden");
  alert("问卷提交成功，您的风险等级为：" + window.parqRiskLevel);
}

function evaluate() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const waist = parseFloat(document.getElementById("waist")?.value);
  const hip = parseFloat(document.getElementById("hip")?.value);
  const age = parseInt(document.getElementById("age").value);
  const injury = document.getElementById("injury").value;
  const demand = document.getElementById("demand").value;
document.getElementById("particles-js").style.opacity = "0"; // 或 display = 'none'

  if (!height || !weight || !age) {
    alert("请填写完整信息");
    return;
  }

  const stdWeight = (height - 100) * 0.9;
  const diff = weight - stdWeight;
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

  let bmiScore = bmi < 18.5 ? 60 : bmi < 24.9 ? 90 : bmi < 29.9 ? 70 : 50;
  let whr = null, whrScore = 80;
  if (waist && hip) {
    whr = (waist / hip).toFixed(2);
    whrScore = whr < 0.8 ? 95 : whr < 0.9 ? 85 : whr < 1.0 ? 70 : 55;
  }
  let parqScore = window.parqRiskLevel === '高风险' ? 40 : window.parqRiskLevel === '中风险' ? 70 : 90;
  if (!window.parqRiskLevel) parqScore = 80;

  const healthScore = Math.round((bmiScore + parqScore + whrScore) / 3);
  document.getElementById("score").innerText = healthScore;

  const report = document.getElementById("report");
  document.getElementById("reportBg")?.classList.add("opacity-0");

  report.innerHTML = `
    <section class="bg-gray-50 p-6 rounded-xl shadow border border-gray-200 space-y-3">
      <h2 class="text-xl font-bold text-gray-800">📈 BMI 对比图</h2>
      <div id="bmiChart" class="h-64"></div>
    </section>
    <section class="bg-gray-50 p-6 rounded-xl shadow border border-gray-200 space-y-3">
      <h2 class="text-xl font-bold text-gray-800">📊 腰臀比图</h2>
      <div id="whrChart" class="h-64"></div>
    </section>
    <section class="col-span-2 bg-gray-50 p-6 rounded-xl shadow border border-gray-200 space-y-3">
      <h2 class="text-xl font-bold text-gray-800">🧠 身体状态分析</h2>
      ${generateBodyStatus(bmi, whr, stdWeight, weight)}
    </section>
    <section class="col-span-2 bg-gray-50 p-6 rounded-xl shadow border border-gray-200 space-y-3">
      <h2 class="text-xl font-bold text-gray-800">🥗 饮食建议</h2>
      <p class="text-gray-800 text-base">${generateDietSuggestion(bmi)}</p>
    </section>
    <section class="col-span-2 bg-gray-50 p-6 rounded-xl shadow border border-gray-200 space-y-3">
      <h2 class="text-xl font-bold text-gray-800">🏋️ 健身建议（目标：${demand}）</h2>
      <p class="text-gray-800 text-base">${generatePlanByDemand(demand)}</p>
    </section>
    <section class="col-span-2 bg-gray-50 p-6 rounded-xl shadow border border-gray-200 space-y-3">
      <h2 class="text-xl font-bold text-gray-800">⚠️ 风险评估等级</h2>
     <p class="text-gray-800 text-base">
  ${
    window.parqRiskLevel === '高风险'
      ? "【高风险】：您的问卷结果显示存在较高的健康风险，可能包括心血管、代谢或骨关节方面的问题。⚠️ 在开始任何运动计划前，建议您先前往医院或体检中心做进一步的医学评估。所有运动建议应在医生或专业健康管理师的监督下进行，避免剧烈运动或高冲击负荷，以防意外发生。"
      : window.parqRiskLevel === '中风险'
      ? "【中风险】：您存在某些潜在健康隐患，如轻度慢性疾病、偶发性不适等。🟡 推荐从低强度有氧（如散步、慢骑车）和简单的徒手训练开始，密切观察身体反应。如果有任何不适，请立即停止锻炼并就医。同时建议建立健康档案，并定期进行身体检查。"
      : window.parqRiskLevel === '低风险'
      ? "【低风险】：您的身体状况总体良好，没有明显运动禁忌。🟢 可以自由选择适合自己的运动方式，包括中高强度训练（如跑步、抗阻训练、游泳等）。不过仍建议注意热身、拉伸、运动后恢复等基础细节，保持良好作息与营养搭配。"
      : "未填写问卷，默认中等风险。⚠️ 建议您尽快填写 PAR-Q 问卷，以便评估个人运动安全性，获取更科学的健身建议。"
  }
</p>


    </section>
  `;

  drawCharts(stdWeight, weight, whr);
}

let chartInstance1 = null;
let chartInstance2 = null;

function drawCharts(std, real, whrVal) {
  chartInstance1 = echarts.init(document.getElementById("bmiChart"));
  chartInstance2 = echarts.init(document.getElementById("whrChart"));

  chartInstance1.setOption({
    backgroundColor: '#fff',
    title: { text: '体重对比', left: 'center' },
    xAxis: { type: 'category', data: ['标准体重', '当前体重'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [std, real],
      itemStyle: { color: (params) => params.dataIndex === 0 ? '#60a5fa' : '#f87171' } }]
  });

  if (whrVal) {
    chartInstance2.setOption({
      backgroundColor: '#fff',
      title: { text: '腰臀比值', left: 'center' },
      xAxis: { type: 'category', data: ['理想值 0.85', '当前值'] },
      yAxis: { type: 'value', min: 0.5, max: 1.5 },
      series: [{ type: 'bar', data: [0.85, parseFloat(whrVal)],
        itemStyle: { color: (params) => params.dataIndex === 0 ? '#34d399' : '#f97316' } }]
    });
  } else {
    chartInstance2.clear();
  }
}
