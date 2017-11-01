let markdown = require('gitbook-markdown');

function processTabs(block) {
  let isFirstTab = true;
  let tabs = Object.keys(block.kwargs).filter(id => !id.startsWith('__')).map(id => {
    let classes = isFirstTab ? 'active' : '';
    isFirstTab = false;
    return `
      <li role="presentation" class="${classes}">
        <a href="#${id}" role="tab" data-toggle="tab">
          ${block.kwargs[id]}
        </a>
      </li>
    `;
  });

  isFirstTab = true;
  let content = block.blocks.filter(block => block.name === 'tab').map(block => {
    let id = block.kwargs['id'];
    let classes = ['tab-pane'];
    if (block.kwargs['class']) {
      classes.push(block.kwargs['class'].replace('active', ''));
    }
    if (isFirstTab) {
      classes.push('active');
    }
    isFirstTab = false;

    return `
      <div role="tabpanel" class="${classes.join(' ')}" id="${id}">
        ${markdown.page(block.body).content}
      </div>
    `;
  });

  return `
    <ul class="nav nav-tabs" role="tablist">
      ${tabs.join("\n")}
    </ul>
    <div class="tab-content">
      ${content.join("\n")}
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
      blocks: ['tab', 'endtab'],
      process: function (block) {
        return processTabs(block);
      }
    }
  }
};
