 var specs = [];

specs.push("tests/router_tests");
specs.push("tests/layout_manager_tests");

for (var i = 0; i < specs.length; i++) {
	System.import(specs[i]).catch(console.error.bind(console));
}