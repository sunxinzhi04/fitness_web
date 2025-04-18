window.addEventListener('DOMContentLoaded', () => {
  console.log("JS Loaded");

  // ✅ 用事件绑定方式绑定按钮点击
  document.getElementById("evalBtn").addEventListener("click", evaluate);

  function evaluate() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const injury = document.getElementById('injury').value;

    if (!height || !weight || !age) {
      alert('请完整填写身高、体重和年龄');
      return;
    }

    const stdWeight = (height - 100) * 0.9;
    const diff = weight - stdWeight;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    let suggestion = '';
    if (diff > 5) suggestion = '🟠 体重偏高：建议减脂训练，搭配低脂饮食。';
    else if (diff < -5) suggestion = '🔵 体重偏低：建议增肌训练，补充蛋白质。';
    else suggestion = '🟢 体重正常：保持良好习惯即可。';

    document.getElementById('result').innerHTML = `
      <p>标准体重：<strong class="text-blue-400">${stdWeight.toFixed(1)} kg</strong></p>
      <p>BMI：<strong class="text-yellow-400">${bmi}</strong></p>
      <p>体重差距：<strong class="text-red-400">${diff.toFixed(1)} kg</strong></p>
      <p><strong class="text-green-400">${suggestion}</strong></p>
    `;

    drawChart(stdWeight, weight);
  }

  function drawChart(std, real) {
    const chartDom = document.getElementById('chart');
    const myChart = echarts.init(chartDom);
    const option = {
      xAxis: { type: 'category', data: ['标准体重', '当前体重'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [std, real],
        itemStyle: {
          color: (params) => params.dataIndex === 0 ? '#60a5fa' : '#f87171'
        }
      }],
      tooltip: {},
    };
    myChart.setOption(option);
  }
});
