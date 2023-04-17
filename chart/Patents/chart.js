(()->
  
  NAME = 'horizontal-bar'

  M = 0

  COLORS   = ['#eaa54b', '#66a1e2', '#8065e4', '#48cb80']
  COLORS_G = ['#b5b5b5', '#8c8c8c', '#6b6b6b', '#565656']
  DATA = [
      { value: 10, desc: 'title 1'},
      { value: 0,  desc: 'title 2'},
      { value: 40, desc: 'title 3'},
      { value: 10, desc: 'title 4' }
  ]

  randomize = (min, max) ->
      DATA.map (d) ->
        d.value = Math.floor Math.random() * (max - min) + min
        d
        
  highlight = (seldata, seli) ->
    d3.event.stopPropagation()   
    
    svg.selectAll '.bar'
      .attr 'fill', (d, i) ->
        if i is seli then COLORS[i] else COLORS_G[i]
          
    d3.select @
      .attr 'x', 15
      .attr 'y', -> +@getAttribute('y') + 15
      .attr 'width', (d) -> xScale(d.value) - 30
      .attr 'height', BAR_HEIGHT - 30
      .transition()
      .duration 500
      .ease 'elastic'
      .attr 'x', 0
      .attr 'y', -> +@getAttribute('y') - 15
      .attr 'height', BAR_HEIGHT
      .attr 'width', (d) -> xScale d.value
    
  highlightClear = (seldata, seli) ->
    d3.event.stopPropagation()   
    
    svg.selectAll '.bar'
      .attr 'fill', (d, i) -> COLORS[i]
    

  MAX_VALUE = d3.max DATA, (d) -> d.value
  TOTAL_VALUE = DATA.reduce (p, c) ->
    if typeof p is 'object'
      p.value + c.value
    else
      p + c.value

  ANIM_DURATION = 750
  ANIM_DELAY    = 300

  oW = window.innerWidth
  oH = window.innerHeight

  W = oW - M - M
  H = oH - M - M

  BAR_HEIGHT = H / DATA.length
  INITIAL_WIDTH = 15

  svg = d3.select '#chart'
    .append 'svg'
    .on 'click', highlightClear
    .attr 'class', NAME
    .attr 'width', oW
    .attr 'height', oH

  xScale = d3.scale.linear()
    .domain [0, MAX_VALUE * 1.5]
    .range  [INITIAL_WIDTH, oW]

  percentScale = d3.scale.linear()
    .domain [0, TOTAL_VALUE]
    .range [0, 100]

  yScale = d3.scale.linear()
    .domain [0, DATA.length]
    .range  [0, oH]

  g = svg.selectAll 'g'
    .data DATA

  container = g.enter()
    .append 'g'

  container.append 'rect'
    .attr 'class', 'bar'
    .attr 'x', 0
    .attr 'y', (d,i) -> i * BAR_HEIGHT
    .attr 'width', INITIAL_WIDTH
    .attr 'height', BAR_HEIGHT
    .attr 'fill', (d, i) -> COLORS[i % DATA.length]
    .on 'click', highlight
    .transition()
    .duration ANIM_DURATION
    .delay (d,i) -> i * 100
    .attr 'width', (d) -> xScale d.value

  container.append 'line'
    .style 'stroke', '#767676'
    .style 'fill', 'none'
    .style 'stroke-width', '1px'
    .attr 'x1', 0
    .attr 'y1', (d,i) -> yScale i
    .attr 'x2', oW
    .attr 'y2', (d,i) -> yScale i

  container.append 'text'
    .attr 'pointer-events', 'none'
    .attr 'class', 'portion'
    .attr 'x', (d,i) -> BAR_HEIGHT * 0.8
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'dy', ".35em"
    .attr 'font-size', "#{BAR_HEIGHT/2.5}px"
    .attr 'text-anchor', 'end'
    .attr 'fill', '#fff'
    .text "0"
    .transition()
    .duration ANIM_DURATION
    .tween 'text', (d) ->
      i = d3.interpolate @textContent, percentScale(d.value)
      (t) -> @textContent = i(t).toFixed(0)

  container.append 'text'
    .attr 'pointer-events', 'none'
    .attr 'class', 'portion_sign'
    .attr 'x', (d,i) -> BAR_HEIGHT * 0.8 + 5
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'dy', ".7em"
    .attr 'font-size', "#{BAR_HEIGHT/5}px"
    .attr 'text-anchor', 'start'
    .attr 'fill', '#fff'
    .text "%"

  container.append 'text'
    .attr 'pointer-events', 'none'
    .attr 'class', 'desc'
    .attr 'x', (d,i) -> BAR_HEIGHT * 1.3
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'dy', "-.35em"
    .attr 'font-size', "#{BAR_HEIGHT/4.7}px"
    .attr 'fill', '#fff'
    .text (d) -> d.desc

  container.append 'text'
    .attr 'pointer-events', 'none'
    .attr 'class', 'item_count'
    .attr 'x', (d,i) -> BAR_HEIGHT * 1.3
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'dy', "1.4em"
    .attr 'font-size', "#{BAR_HEIGHT/7.1}px"
    .attr 'fill', '#fff'
    .style 'opacity', .7
    .text (d) -> "#{d.value} items"

  # path from "https://github.com/google/material-design-icons/blob/master/navigation/svg/design/ic_chevron_right_48px.svg"
  container.append 'path'
    .attr 'class', 'arrow'
    .attr 'd', 'M15 9l-2.12 2.12L19.76 18l-6.88 6.88L15 27l9-9z'
    .attr 'viewBox', '0 0 36 36'
    .attr 'transform', (d,i) ->
      "translate(#{oW-60}, #{yScale(i) + BAR_HEIGHT / 2 - 18})"
    .style 'fill', '#fff'

  g.exit().remove()

  resize =->
    oW = window.innerWidth
    oH = window.innerHeight

    W = oW - M - M
    H = oH - M - M

    BAR_HEIGHT = H / DATA.length

    svg.attr 'width', oW
      .attr 'height', oH

    xScale.range [INITIAL_WIDTH, oW]
    yScale.range [0, oH]

    g = svg.selectAll 'g'

    g.select '.bar'
    .attr 'y', (d,i) -> i * BAR_HEIGHT
    .attr 'height', BAR_HEIGHT
    .transition()
    .duration ANIM_DURATION
    .delay (d,i) -> i * 100
    .attr 'width', (d) -> xScale d.value

    g.select 'line'
    .attr 'y1', (d,i) -> yScale i
    .attr 'x2', oW
    .attr 'y2', (d,i) -> yScale i

    g.select '.portion'
    .attr 'x', (d,i) -> BAR_HEIGHT * 0.8
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'pointer-events', 'none'
    .attr 'font-size', "#{BAR_HEIGHT/2.5}px"

    g.select '.portion_sign'
    .attr 'x', (d,i) -> BAR_HEIGHT * 0.8 + 5
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'pointer-events', 'none'
    .attr 'font-size', "#{BAR_HEIGHT/5}px"

    g.select '.desc'
    .attr 'x', (d,i) -> BAR_HEIGHT * 1.3
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'pointer-events', 'none'
    .attr 'font-size', "#{BAR_HEIGHT/4.7}px"

    g.select '.item_count'
    .attr 'x', (d,i) -> BAR_HEIGHT * 1.3
    .attr 'y', (d,i) -> yScale(i) + BAR_HEIGHT / 2
    .attr 'pointer-events', 'none'
    .attr 'font-size', "#{BAR_HEIGHT/7.1}px"

    g.select '.arrow'
    .attr 'pointer-events', 'none'
    .attr 'transform', (d,i) ->
      "translate(#{oW-60}, #{yScale(i) + BAR_HEIGHT / 2 - 18})"

  update = (data)->
    MAX_VALUE = d3.max DATA, (d) -> d.value
    TOTAL_VALUE = DATA.reduce (p, c) ->
      if typeof p is 'object'
        p.value + c.value
      else
        p + c.value
    BAR_HEIGHT = H / DATA.length

    xScale.domain [0, MAX_VALUE * 1.5]
    yScale.domain [0, DATA.length]
    percentScale.domain [0, TOTAL_VALUE]

    g = svg.selectAll 'g'
      .data data

    g.select '.bar'
    .transition()
    .duration ANIM_DURATION
    .delay (d,i) -> i * 100
    .attr 'width', (d) -> xScale d.value
    .attr 'fill', (d, i) -> COLORS[i]

    g.select '.portion'
    .transition()
    .duration ANIM_DURATION
    .tween 'text', (d) ->
      i = d3.interpolate @textContent, percentScale(d.value)
      (t) -> @textContent = i(t).toFixed(0)

    g.select '.item_count'
    .text (d) -> "#{d.value} items"
    
  d3.select window
    .on 'resize', resize

  # for DEBUG
  host = window.location.hostname
  if host is 's.codepen.io' or host is 'localhost'
    setInterval (-> update randomize 0, 20), 6000

)(window)