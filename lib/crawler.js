module.exports = ($, targets, combine = true) => {
  const res = [];
  for(let i = 0; i < targets.length; i++) {
    res.push({
      target: targets[i],
      data: getTarget($, targets[i]),
    });
  }
  return combine ? combineTargetGroups(res) : res;
};

function getTarget($, target) {
  const res = [];
  let targetEl = $(target.selector).each((i, el) => {
    elData = {};
    if (target.child) {
      el = $(el).children(target.child.selector)[target.child.nth || 0];
    }
    if (target.props) {
      target.props.forEach(prop => elData[prop] = $(el).prop(prop));
    }
    if (target.attrs) {
      target.attrs.forEach(attr => elData[attr] = $(el).attr(attr));
    }
    if (target.text) {
      elData[target.textAltLabel || 'text'] = $(el).text() || null;
    }
    if (target.data) {
      target.data.forEach(dataProp => elData[dataProp] = $(el).data(dataProp));
    }
    res.push(elData);
  });
  return res;
};

function combineTargetGroups(groups)  {
  const res = {
    meta: {
      targets: [],
    },
    data: [],
  };
  let resultsMatch = true;
  let resultsCheck = null;
  groups.forEach((group) => {
    group.target.results = group.data.length;
    res.meta.targets.push(group.target);
    if (resultsCheck === null) {
      resultsCheck = group.data.length;
    } else if (resultsMatch && resultsCheck !== group.data.length) {
      resultsMatch = false;
    }
    res.data = group.data.map((dataPoint, i) => {
      return Object.assign(dataPoint, res.data[i]);
    })
  });
  if (!resultsMatch) {
    res.error = 'Error combining target groups: number of results do not match for all groups';
  }
  return res;
}