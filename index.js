var markdown = require('gitbook-markdown');
var COUNTER = 0;

function kitchenSink(block) {
  var isFirstTab = true;

  var tabs = block.blocks.map(function(subBlock) {
    subBlock.id = subBlock.name + '-' + ++COUNTER;
    subBlock.isActive = false;
    var href = '#' + subBlock.id;
    var classString = '';
    if (isFirstTab) {
      classString = 'active';
      subBlock.isActive = true;
      isFirstTab = false;
    }

    return `
      <li role="presentation" class="${classString}">
        <a href="${href}" role="tab" data-toggle="tab">
          ${block.kwargs[subBlock.name]}
        </a>
      </li>
    `;
  }).join('');

  var tabContent = block.blocks.map(function(subBlock) {
    var classString = 'tab-pane';
    if (subBlock.isActive) {
      classString += ' active';
    }

    return `
      <div role="tabpanel" class="${classString}" id="${subBlock.id}">
        ${markdown.page(subBlock.body).content}
      </div>
    `;
  }).join('');

  return `
    <ul class="nav nav-tabs" role="tablist">
      ${tabs}
    </ul>
    <div class="tab-content">
      ${tabContent}
    </div>
  `;
}

module.exports = {

  book: {
    assets: './assets',
    css: [
      'bootstrap.css'
    ],
    js: [
      'bootstrap.js'
    ]
  },

  blocks: {
    tabs: {
      blocks: ['tab1', 'tab2'],
      process: function(block) {
        return kitchenSink(block);
      }
    }
  }

};
