var items = [
  [190, 100, "Honor Leapstone"],
  [455, 130, "Great Honor Leapstone"],
  [258, 500, "Honor Shard Pouch (L)"],
  [511, 550, "Solar Grace"],    
  [490, 570, "Solar Blessing"],
  [595, 590, "Solar Protection"],    
  [117, 60, "Destruction Stone Crystal"],
  [69, 10, "Guardian Stone Crystal"],
  [289, 1470, "Power of Sage"]              
];  
//The first value is 0, that's the table header/not used.
//0, 30, 50, ... , ..., ..., , ..., 20, 20, ... still needs confirmation. 
var crystalRatio = [
  0, 30, 50, 30, 30, 30, 30, 20, 20, 40
]

//Check thursday the minimums, this should be the minimum crystal value.
var defaultCrystals = [
  100, 130, 500, 550, 570, 590, 60, 10, 1470
]


document.querySelector('#reset-values').addEventListener('click', resetCrystalValues)

document.querySelectorAll('.increment').forEach(item => {
  item.addEventListener('click', increaseCrystals)
})
document.querySelectorAll('.decrement').forEach(item => {
  item.addEventListener('click', decreaseCrystals)
})
//Gold must be the first row in HTML
document.querySelectorAll('td:first-child').forEach(item => {
  item.addEventListener('input', calculateGoldToCrystalRatio)
})


green_timer = null;
red_timer = null;
orig = '#000000'

function resetTimersAll() {
  clearTimeout(green_timer);
  clearTimeout(red_timer);
  for (var i = 1; i < rowsToFill + 1; i++)
  {
    table.rows[i].cells[1].style.color = orig;
  }
}

function fontToGreenFor1s(obj){
  //Goes back to black.
  obj.style.color = '#76EA83';
  green_timer = setTimeout(function(){
       obj.style.color = orig;
  }, 1000);
}

function fontToRedFor1s(obj){
  //Goes back to black.

  obj.style.color = '#FF4A4A';
  red_timer = setTimeout(function(){
       obj.style.color = orig;
  }, 1000);
}

rowsToFill = items.length;
const columnsToFill = 3;
const goldString = ' Gold';
const crystalString = ' Crystal';

const table = document.getElementById("gold-crystal-table");



//Formats to 3 decimal places..
const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,      
  maximumFractionDigits: 3,
});



function calculateGoldToCrystalRatio() {
  //Negative values will be converted to positive. 
  let gold, crystal;
  for (var i = 1; i < rowsToFill + 1; i++)
  {
      //Check that both is a valid float or int
      gold = parseFloat(table.rows[i].cells[0].innerHTML);
      crystal = parseFloat(table.rows[i].cells[1].innerHTML);
      if (isNaN(gold) || isNaN(crystal))
      {
          table.rows[i].cells[3].innerHTML = "N/A";
      }
      else
      {
          let value = formatter.format(gold/crystal); 
      
          table.rows[i].cells[3].innerHTML = Math.abs(value); 
      }
  } 
  saveValues();
}

function increaseCrystals() {
  //To Do: Adjust based on array of item increase.
  let rowNum = this.parentNode.id;
  let crystals = parseFloat(table.rows[rowNum].cells[1].innerHTML); 
  table.rows[rowNum].cells[1].innerHTML = crystals + crystalRatio[rowNum];
  //Clear colors in case one is in prorgess
  resetTimersAll();
  fontToGreenFor1s(table.rows[rowNum].cells[1]);
  calculateGoldToCrystalRatio();
}

function decreaseCrystals() {
  let rowNum = this.parentNode.id;
  let crystalsAfterDecrease = parseFloat(table.rows[rowNum].cells[1].innerHTML) - crystalRatio[rowNum]; 
  //Check so crystals can't below the minimum.
  if (crystalsAfterDecrease >= defaultCrystals[rowNum])
  {
    table.rows[rowNum].cells[1].innerHTML = crystalsAfterDecrease;
    resetTimersAll();
    fontToRedFor1s(table.rows[rowNum].cells[1]);
    calculateGoldToCrystalRatio();
  }
}

function saveValues(){
  for (var i = 0; i < items.length; i++)
  {
    let gold = parseFloat(table.rows[i+1].cells[0].innerHTML);
    let crystal = parseFloat(table.rows[i+1].cells[1].innerHTML);
    localStorage.setItem(items[i][2] + goldString, gold);
    localStorage.setItem(items[i][2] + crystalString, crystal);
  }
}

function removeValues(){
  for (var i = 0; i < items.length; i++)
  {
    localStorage.removeItem(items[i][2] + goldString);
    localStorage.removeItem(items[i][2] + crystalStringString);
  }
}

function loadValues(){
  //Boot up local storage values on startup. If it exists.
  for (var i = 0; i < items.length; i++)
  {
    let goldValue = localStorage.getItem(items[i][2] + goldString);
    let crystalValue = localStorage.getItem(items[i][2] + crystalString);
    if (goldValue === null || crystalValue === null) {
      //Do nothing if no value is found.
    }
    else {
      table.rows[i+1].cells[0].innerHTML = goldValue;
      table.rows[i+1].cells[1].innerHTML = crystalValue;
    }
  }
  calculateGoldToCrystalRatio();
}

function resetToDefaultValues(){
  for (var i = 1; i < rowsToFill + 1; i++)  //As the first row is the header we skip the first index. And increment rows to Fill by 1.
  {
    for (var j = 0; j < columnsToFill; j++)
      {
        table.rows[i].cells[j].innerHTML = items[i-1][j]; //We minus the i index to align with skipping the first row. So we don't skip the first item in the array.
      }
  }
  calculateGoldToCrystalRatio();
}

//Run if no application data is found.
function startUp(){
  for (var i = 1; i < rowsToFill + 1; i++)  //As the first row is the header we skip the first index. And increment rows to Fill by 1.
  {
    for (var j = 0; j < columnsToFill; j++)
      {
        table.rows[i].cells[j].innerHTML = items[i-1][j]; //We minus the i index to align with skipping the first row. So we don't skip the first item in the array.
      }
  }
}

//On Thursday all Crystal Valuse reset.
function resetCrystalValues(){
  for (var i = 0; i < rowsToFill; i++)
    {
      table.rows[i+1].cells[1].innerHTML = items[i][1]; 
    }
  calculateGoldToCrystalRatio()
}

startUp();
loadValues();



