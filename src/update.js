export default function update(data, layout, extend = true) {

  if(!extend) {
    this.data = [];
    this.layout = {}
  }

  // Overwrite with new data.
  this.data = data;

  // Extend new layout.
  Object.assign(this.layout, layout);

  render(this);

};


function render(plot) {
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  rect.setAttribute('width', 100);
  rect.setAttribute('height', 100);
  rect.setAttribute('x', 0);
  rect.setAttribute('y', 10);

  plot.canvas.appendChild(rect);
}
