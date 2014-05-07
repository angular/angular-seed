// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
var nodes = [
        //  {id: 0, reflexive: false},
        // {id: 1, reflexive: false},
        //{ id: 2, reflexive: false}

    ],
    lastNodeId = -1,
    links =
        [
            //       {source: nodes[0], target: nodes[1], left: false, right: false,synchronize:true},
            //       
            //       {source: nodes[1], target: nodes[2], left: false, right: false,synchronize:false}
        ];
var width = window.innerWidth - 5,
    height = window.innerHeight - 5,
// colors = d3.scale.category10(),
    rNode = 32;
//   colorNode = 2;

// set up SVG for D3
var svg, force, drag, drag_line, path, circle;
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null,
    clickNode = null;
var flAdd_node = false,
    flDelete = false,
    flsynchronize = true;


svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);


// init D3 force layout
initD3Force();
// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// line displayed when dragging new nodes
drag_line = svg.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0');

// handles to link and node element groups
path = svg.append('svg:g').selectAll('path');
circle = svg.append('svg:g').selectAll('g');

// mouse event vars
selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;
svg.on('mousedown', mousedown)
    .on('mousemove', mousemove)
    .on('mouseup', mouseup);

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}
function dragstart(d) {
    d.fixed = true;
    d3.select(this).classed("fixed", true);
}
// update force layout (called automatically each iteration)
function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', function (d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = rNode - 10,
            targetPadding = rNode - 10,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    circle.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });

}

// update graph (called when needed)
function restart() {
    //close all table
    ntable = document.getElementById("l-table");
    closeEl(ntable);
    ntable = document.getElementById("n-table");
    closeEl(ntable);
    // path (link) group 

    path = path.data(links);
    // update existing links

    path.classed('selected', function (d) {
        return d === selected_link;
    }).attr('class',
        function (d) {
            // console.log(d.synchronize);
            return d.synchronize == false ? 'link' : 'linksyn';
        })
        .style('marker-start', function (d) {
            //console.log(d.left);
            return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function (d) {
            return d.right ? 'url(#end-arrow)' : '';
        });

    // add new links
    path.enter().append('svg:path')
        .attr('class', function (d) {
            return d.synchronize == false ? 'link' : 'linksyn';
        })
        .classed('selected', function (d) {
            return d === selected_link;
        })
        .style('marker-start',
        function (d) {
            return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function (d) {
            return d.right ? 'url(#end-arrow)' : '';
        }
    )
        .on('mousedown', function (d) {
            // select link
            mousedown_link = d;
            if (mousedown_link === selected_link)
                selected_link = null;
            else
                selected_link = mousedown_link;
            selected_node = null;
            if (flDelete) {
                links.splice(links.indexOf(mousedown_link), 1);
            }
            restart();
        }).on("dblclick", function (d) {
            mousedown_link = d;
            showDadaLink(d);
        });

    // remove old links
    path.exit().remove();


    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, function (d) {
        return d.id;
    });

//    // update existing nodes (reflexive & selected visual states)
//    circle.selectAll('circle')
//            .style('fill', function(d) {
//
//        return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);
//    })
//            .classed('reflexive', function(d) {
//        return d.reflexive;
//    });

    // add new nodes
    var g = circle.enter().append('svg:g');

    g.append('svg:image')
        .attr('class', 'node')
        .attr("xlink:href", "../img/task.ico")
        .attr("x", -rNode / 2 + "px")
        .attr("y", -rNode / 2 + "px")
        .attr("width", rNode + "px")
        .attr("height", rNode + "px")
//    g.append('svg:circle')
//            .attr('class', 'node')
//            .attr('r', rNode)
//            .style('fill', function(d) {
//        
//       
//        return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);
//    })
//            .style('stroke', function(d) {
//        return d3.rgb(colors(d.id)).darker().toString();
//    })
//            .classed('reflexive', function(d) {
//        return d.reflexive;
//    })
        .on('mouseover', function (d) {
            if (!mousedown_node || d === mousedown_node)
                return;
            // enlarge target node
            d3.select(this).attr('transform', 'scale(1.1)');
        })
        .on('mouseout', function (d) {
            if (!mousedown_node || d === mousedown_node)
                return;
            // unenlarge target node
            d3.select(this).attr('transform', '');
        })
        .on('mousedown', function (d) {
            // select node
            mousedown_node = d;
            if (mousedown_node === selected_node)
                selected_node = null;
            else
                selected_node = mousedown_node;
            if (flDelete) {
                nodes.splice(nodes.indexOf(mousedown_node), 1);
                spliceLinksForNode(mousedown_node);
            }

            selected_link = null;
            if (flAdd_node || flDelete) {
                circle.call(force.drag);
                return;
            }
            else {
                circle
                    .on('mousedown.drag', null)
                    .on('touchstart.drag', null);
            }
            // reposition drag line
            drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', false)
                .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

            restart();

        }).on("dblclick", function (d) {
            clickNode = d;
            showData(this, clickNode);
        })
        .on('mouseup', function (d) {
            if (!mousedown_node)
                return;

            // needed by FF
            drag_line
                .classed('hidden', true)
                .style('marker-end', '');

            // check for drag-to-self
            mouseup_node = d;
            if (mouseup_node === mousedown_node) {
                resetMouseVars();
                return;
            }

            // unenlarge target node
            d3.select(this).attr('transform', '');

            // add link to graph (update if exists)
            // NB: links are strictly source < target; arrows separately specified by booleans
            var source, target, direction;
            if (mousedown_node.id < mouseup_node.id) {
                source = mousedown_node;
                target = mouseup_node;
                direction = 'right';
            } else {
                source = mouseup_node;
                target = mousedown_node;
                direction = 'left';
            }

            var link;
            link = links.filter(function (l) {
                return (l.source === source && l.target === target);
            })[0];

            if (link) {
                link[direction] = true;
            } else {
                link = {source: source, target: target, left: false, right: false, synchronize: false};
                link[direction] = true;
                links.push(link);
            }

            // select new link
            selected_link = link;
            selected_node = null;

            restart();

        });

    // show node IDs
    g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text(function (d) {
            return d.id;
        });

    // remove old nodes
    circle.exit().remove();

    // set the graph in motion
    force.start();
}

function mousedown() {
    // prevent I-bar on drag
    d3.event.preventDefault();

    // because :active only works in WebKit?
    svg.classed('active', true);

    if (!flAdd_node || mousedown_node || mousedown_link) {
        restart();
        return;
    }
    // insert new node at point
    var point = d3.mouse(this),
        node = {id: ++lastNodeId, reflexive: false};
    node.x = point[0];
    node.y = point[1];
    nodes.push(node);

    restart();
}

function mousemove() {
    if (!mousedown_node)
        return;

    // update drag line
    drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

    restart();
}

function mouseup() {
    if (mousedown_node) {
        // hide drag line
        drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
}

function spliceLinksForNode(node) {
    var toSplice = links.filter(function (l) {
        return (l.source === node || l.target === node);
    });
    toSplice.map(function (l) {
        links.splice(links.indexOf(l), 1);
    });
}

// app starts here
restart();


function save() {
    var savelinks = [];
    for (var i = 0; i < links.length; i++) {
        node = {source: links[i].source.id, target: links[i].target.id, lcapacity: links[i].lcapacity, lspeed: links[i].lspeed, left: links[i].left, right: links[i].right, synchronize: links[i].synchronize};
        savelinks.push(node);
    }

    var savestr = "{\"nodes\":" + JSON.stringify(nodes) + "," + "\"links\":" + JSON.stringify(savelinks) + "}";

    var blob = new Blob([savestr], {type: "text/json;charset=utf-8"});
    saveAs(blob, "graph.json");
    clearFl();
}

function restore() {
    d3.json("graph.json", function (error, graph) {
        nodes = graph.nodes;
        links = graph.links;
        lastNodeId = nodes.length;
        initD3Force();
        restart();
    });
    clearFl();
}

function showData(el, node) {
    ntable = document.getElementById("n-table");
    ntable.style.display = 'block';
    doc = document.getElementsByTagName('body');
    var point = d3.mouse(doc[0]);
    var pointel = d3.mouse(el);
    var height_of_doc = doc[0].clientHeight;
    var width_of_doc = doc[0].clientWidth;
    var height_of_table = ntable.clientHeight;
    console.log("----------------")
    console.log("height_of_table=" + height_of_table)
    console.log("height_of_doc=" + height_of_doc)
    console.log("p=" + point[1])
    console.log("pEl=" + pointel[1])
    var width_of_table = ntable.clientWidth;
    if ((point[0] + width_of_table) > width_of_doc) {
        ntable.style.left = (point[0] - width_of_table) - pointel[0] - rNode + 'px';
    } else {
        ntable.style.left = point[0] - pointel[0] + rNode + 'px';
    }

    if ((point[1] + height_of_table) > height_of_doc) {
        console.log("-1")
        ntable.style.top = point[1] - ((point[1] + height_of_table) - height_of_doc) - 40 + 'px';
    } else {
        console.log("-2")
        ntable.style.top = point[1] - pointel[1] + 'px';
    }
    document.getElementById('n-id').value = node.id;
    document.getElementById('n-descr').value = node.descr;
    document.getElementById('n-cmd').value = node.cmd;
    document.getElementById('n-arch').value = node.arch;
    document.getElementById('n-os').value = node.os;
    document.getElementById('n-ram').value = node.ram;
    document.getElementById('n-cputime').value = node.cputime;
    // document.getElementById('n-fz').setAttribute("value",node.fz);
    // document.getElementById('n-memory').value = node.fdata;


}
function showDadaLink(link) {
    ntable = document.getElementById("l-table");
    ntable.style.display = 'block';
    doc = document.getElementsByTagName('body');
    var point = d3.mouse(doc[0]);
    var height_of_doc = doc[0].clientHeight;
    var width_of_doc = doc[0].clientWidth;
    var height_of_table = ntable.clientHeight;
    var width_of_table = ntable.clientWidth;
    if ((point[0] + width_of_table) > width_of_doc) {
        ntable.style.left = (point[0] - width_of_table) + 'px';
    } else {
        ntable.style.left = point[0] + 'px';
    }
    if ((point[1] + height_of_table) > height_of_doc) {
        ntable.style.top = point[1] - height_of_table + 'px';
    } else {
        ntable.style.top = point[1] + 'px';
    }
    document.getElementById('l-capacity').value = link.lcapacity;
    document.getElementById('l-speed').value = link.lspeed;
//    console.log(link.synchronize)
    if (link.synchronize)
        document.getElementById('syn').checked = true;
    else
        document.getElementById('notsyn').checked = true;
}
function closeEl(el) {
    el.style.display = 'none';
}
function saveNode() {
    ntable = document.getElementById("n-table");
    var id = clickNode.id;
    //nodes[id].name = document.getElementById('n-name').value;
    nodes[id].descr = document.getElementById('n-descr').value;
    nodes[id].cmd = document.getElementById('n-cmd').value;
    nodes[id].arch = document.getElementById('n-arch').value;
    nodes[id].os = document.getElementById('n-os').value;
    nodes[id].ram = document.getElementById('n-ram').value;
    nodes[id].cputime = document.getElementById('n-cputime').value;
    // nodes[id].fz=document.getElementById('n-fz').files[0].name;
    //nodes[id].fdata=document.getElementById('n-fdata').files[0].name;
    closeEl(ntable);

}
function saveLink() {
    ntable = document.getElementById("l-table");
    var id = links.indexOf(mousedown_link);
    links[id].synchronize = document.getElementById('syn').checked;
    links[id].lcapacity = document.getElementById('l-capacity').value;
    links[id].lspeed = document.getElementById('l-speed').value;
    restart()
}
function addNode() {
    clearFl();
    flAdd_node = true;
    document.getElementsByTagName("svg")[0].style.cursor = 'crosshair';

}
function addLink() {
    clearFl();
    document.getElementsByTagName("svg")[0].style.cursor = 'url("../img/pointer_link.ico"),link';
}

function clearSpace() {
    clearFl();
    ntable = document.getElementById("l-table");
    closeEl(ntable);
    ntable = document.getElementById("n-table");
    closeEl(ntable);
    nodes = [];
    links = [];
    lastNodeId = -1;
    initD3Force();
    restart();
}
function delete_node_link() {
    clearFl();
    flDelete = true;
    document.getElementsByTagName("svg")[0].style.cursor = 'url("../img/pointer_delete.ico") 9 9,delete';
    restart();
}
function clearFl() {
    flAdd_node = false;
    flDelete = false;
}

function initD3Force() {
    force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .linkStrength(0)

        .charge(0)//for not auto alignment
        .gravity(0)//for not flying node
        .on('tick', tick);
    drag = force.drag()
        .on("dragstart", dragstart);
}