var txt;
var line_length;
var line_result;
var result;
var heading = "Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item";
var img_pos;
var handle;
var description;
var publish_flag;
var props_line;
var main_features;
var body_html;
var inventory_heading = 'Handle,Title,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,SKU,HS Code,COO,"2133A LOURDES STREET, SAN MIGUEL VILLAGE,",Italy Warehouse';
var inventory_line;
var inventory_result;

//when click choose file, read file and save to txt
document.getElementById('inputfile').addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        // Read file and save into txt
        txt = fr.result;
        convert_file();
        save_file();
    }
    fr.readAsText(this.files[0]);
})

function convert_file() {

    var line = txt.split("\n");

    result = ""; //initialise result
    inventory_result = ""; // initialise inventory_result

    line_length = line.length;
    var cell = new Array(line_length + 1);

    // Create 2 demensional array for cell
    for (let i = 0; i < line_length; i++) {
        cell[i] = new Array(100); // each line has 42 delimiters of ";"
    }

    //loop all lines and make result
    for (let i = 0; i < line_length; i++) {
        if (line[i].length == 0) break; //last line exception

        let tmp_cell = line[i].split(";"); //split line into cells

        for (let j = 0; j < tmp_cell.length; j++) {

            //get rid of '"' in a cell data
            while (tmp_cell[j].indexOf('"') != -1) {
                var n = tmp_cell[j].indexOf('"');
                tmp_cell[j] = tmp_cell[j].substr(0, n) + tmp_cell[j].slice(n + 1);
            }


            //eliminating the last ,,,,s
            if (j == tmp_cell.length - 1) {
                tmp_cell[j] = tmp_cell[j].slice(0, (tmp_cell[j].length - 1));
                while (tmp_cell[j].slice(-1) == ",") {
                    tmp_cell[j] = tmp_cell[j].slice(0, (tmp_cell[j].length - 1));
                }
            }

            //assign value to cell
            cell[i][j] = tmp_cell[j];

        }


        //exception handle, some product contains WIdth information in description
        if (tmp_cell.length == 43) {
            cell[i][13] += cell[i][14];
            cell[i].splice(14, 1);
        }

        //making a result line 
        line_result = "";
        inventory_line = "";

        if (i == 0)
        //add heading line
        {
            line_result = heading;
            add_result();
            inventory_line = inventory_heading;
            add_inventory_result();
        } else
        //add content
        {
            //check current line is the same product
            if (cell[i][2] != cell[i - 1][2])
            //insert as a new product
            {
                //initialise image order
                img_pos = 0;
                //loop by images
                for (let k = 32; k < 42; k++) {
                    img_pos++;

                    if (k == 32)
                    //first line of new product
                    {
                        //make handle();
                        var search, replaceWith;
                        handle = cell[i][9];

                        search = ' ';
                        replaceWith = '-';
                        handle = handle.split(search).join(replaceWith);

                        search = "/";
                        replaceWith = '-';
                        handle = handle.split(search).join(replaceWith);
                        handle = handle.toLowerCase();

                        search = "---";
                        replaceWith = '-';
                        handle = handle.split(search).join(replaceWith);
                        handle = handle.toLowerCase();

                        search = "--";
                        replaceWith = '-';
                        handle = handle.split(search).join(replaceWith);
                        handle = handle.toLowerCase();

                        //make_body_html();
                        main_features = '"<b>Main Features</b><ul>';
                        description = '<b>Product measurements ( decimal  Imperial )</b><ul><li>Dimensions: ';
                        description = description + cell[i][18] + " x " + cell[i][17] + " x " + cell[i][16] + "cm" + "</li>" + "<li>Weight: " + cell[i][19] + " Kg" + "</li>" + "</ul>";

                        if (cell[i][13].indexOf(" - ") != -1) {
                            props_line = cell[i][13].split(" - ");
                            for (let props_num = 0; props_num < props_line.length; props_num++) {
                                let props_name_and_content = props_line[props_num].split(": ");


                                if (props_name_and_content[0] == "Composition" || props_name_and_content[0] == "Features") {

                                    if (props_name_and_content[1] == undefined) break;
                                    if (props_name_and_content[1].indexOf(",") == -1) {
                                        main_features += "<li>" + props_name_and_content[1] + "</li>";
                                    } else {
                                        props_content = props_name_and_content[1].split(",");
                                        for (let props_con_num = 0; props_con_num < props_content.length; props_con_num++) {
                                            main_features += "<li>";
                                            main_features += props_content[props_con_num];
                                            main_features += "</li>";
                                        }
                                    }

                                    // main_features += "</ul>";
                                } else {
                                    description += "<b>" + props_name_and_content[0] + "</b>" + "<ul>";
                                    if (props_name_and_content[1] == undefined) break;
                                    if (props_name_and_content[1].indexOf(",") == -1) {
                                        description += "<li>" + props_name_and_content[1] + "</li>";
                                    } else {
                                        props_content = props_name_and_content[1].split(",");
                                        for (let props_con_num = 0; props_con_num < props_content.length; props_con_num++) {
                                            description += "<li>";
                                            description += props_content[props_con_num];
                                            description += "</li>";
                                        }
                                    }

                                    description += "</ul>";
                                }
                            }
                        }
                        main_features += "</ul>";
                        body_html = main_features + description + '"';

                        // make_published_flag();
                        if (cell[i][31] == "") { publish_flag = "FALSE"; } else { publish_flag = "TRUE"; }

                        //some lines don't have image1, instead it is "\n", have to replace with ""
                        // if (cell[i][k] == "\n") cell[i][k] = "";

                        line_result = handle + "," + cell[i][9] + "," + body_html + "," + "Tuscany Leather" + "," + cell[i][1] + "," + "" + "," + publish_flag + "," + "Color" + "," + cell[i][10] + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][5] + "," + cell[i][19] * 1000 + "," + "shopify" + "," + cell[i][6] + "," + "deny" + "," + "manual" + "," + cell[i][25] + "," + "" + "," + "TRUE" + "," + "FALSE" + "," + "" + "," + cell[i][k] + "," + img_pos + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][k] + "," + "Kg" + "," + "" + "," + "";
                        inventory_line = handle + "," + cell[i][9] + "," + "Color" + "," + cell[i][10] + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][5] + "," + "," + "," + cell[i][6] + "," + "not stocked";
                        add_result();
                        add_inventory_result();
                    } else
                    //from second line of new product
                    {
                        //if no more images, break circulation
                        if (cell[i][k] == "") break;
                        line_result = handle + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][k] + "," + img_pos + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "";
                        add_result();
                    }

                }
            } else
            //insert as same product
            {
                //loop by images
                for (let k = 32; k < 42; k++) {
                    img_pos++;

                    if (k == 32)
                    //first line of same product with dfferent variant
                    {
                        //some lines don't have image1, instead it is "\n", have to replace with ""
                        // if (cell[i][k] == "\n") cell[i][k] = "";

                        line_result = handle + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][10] + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][19] * 1000 + "," + "shopify" + "," + cell[i][6] + "," + "deny" + "," + "manual" + "," + cell[i][25] + "," + "" + "," + "TRUE" + "," + "FALSE" + "," + "" + "," + cell[i][k] + "," + img_pos + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][k] + "," + "Kg" + "," + "" + "," + "";
                        inventory_line = handle + "," + "" + "," + "" + "," + cell[i][10] + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "," + "," + cell[i][6] + "," + "not stocked";
                        add_result();
                        add_inventory_result();
                    } else
                    //from second line of same product with dfferent variant
                    {
                        //if no more images, break circulation
                        if (cell[i][k] == "") break;
                        line_result = handle + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + cell[i][k] + "," + img_pos + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "" + "," + "";
                        add_result();
                    }
                }
            }
        }

    }
}

function save_file() {
    // testing with result
    // result = "4" + "\n" + "7"

    var file = new File([result], "myFilename.txt", { type: "application/octet-stream" });
    var blobUrl = (URL || webkitURL).createObjectURL(file);
    // window.location = blobUrl;
    var file_2 = new File([inventory_result], "myFilename.txt", { type: "application/octet-stream" });
    var blobUrl_2 = (URL || webkitURL).createObjectURL(file_2);

    document.getElementById('download_link').href = blobUrl;
    document.getElementById('download_link_2').href = blobUrl_2;

    // let blob = new Blob(["Hello, world!"], {type: 'text/plain'});
    // link.href = URL.createObjectURL(blob);

    alert("Converted. You can now download it.");
}


function add_result() {
    result += line_result;
    result += "\n";
    line_result = "";
}

function add_inventory_result() {
    inventory_result += inventory_line;
    inventory_result += "\n";
    inventory_line = "";
}