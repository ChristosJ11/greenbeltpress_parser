const canvas = document.getElementById("pieChart");
const ctx = canvas.getContext("2d");
const data = [25, 35, 40]; // Example data for four categories (percentages)
const colors = ["#F4BB44", "#FF5F1F", "#8B4000"]; // Colors for the categories
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 3;

let startAngle = 0;

data.forEach((percentage, index) => {
    const sliceAngle = (percentage / 100) * Math.PI * 2;
    ctx.fillStyle = colors[index];

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();

    ctx.fill();

    startAngle += sliceAngle;
});