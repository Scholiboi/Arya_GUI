const current_time =[];
const packet_count =[]; 
const altitude =[]; 
const air_speed =[]; 
const Temperature =[]; 
const voltage =[]; 
const pressure =[]; 
const gps_altitude =[]; 
const gps_latitude =[];  
const gps_longitude =[];   
const tilt_x_y = [];
const gyro_rate = [];
const mode = [];
const state = []; 
const hs_deployed = []; 
window.onload = function() {
    (function (){
        fetch('test.csv')
        .then(response => response.text())
        .then(text => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
        //   current_time.length = 0;
          complete: (results) => {
            results.data.forEach(row => {
                if (row['MISSION_TIME']) {
                    current_time.push(row['MISSION_TIME']);
                    console.log("mission-time done")
                }
                if (row['PACKET_COUNT']) {
                    packet_count.push(row['PACKET_COUNT']);
                    console.log("packet_count done")
                }
                if (row['ALTITUDE']) {
                    altitude.push(row['ALTITUDE']);
                    console.log("altitude done")
                }
                if (row['TEMPERATURE']) {
                    Temperature.push(row['TEMPERATURE']);
                    console.log("Temperature done")
                }
                if (row['VOLTAGE']) {
                    voltage.push(row['VOLTAGE']);
                    console.log("voltage done")
                }
                if (row['PRESSURE']) {
                    pressure.push(row['PRESSURE']);
                    console.log("PRESSURE done")
                }
                if (row['GPS_ALTITUDE']) {
                    gps_altitude.push(row['GPS_ALTITUDE']);
                    console.log("GPS_ALTITUDE done")
                }
                if (row['GPS_LATITUDE']) {
                    gps_latitude.push(row['GPS_LATITUDE']);
                    console.log("GPS_LATITUDE done")
                }
                if (row['GPS_LONGITUDE']) {
                    gps_longitude.push(row['GPS_LONGITUDE']);
                    console.log("GPS_LONGITUDE done")
                }
                if (row['TILT_X' || 'TILT_Y']) {
                    x = row['TILT_X']
                    y = row['TILT_Y']
                    tilt_x_y.push(x+','+y);
                }
                if (row['ROT_Z']) {
                    gyro_rate.push(row['ROT_Z']);
                    console.log("ROT_Z done")
                }
                if (row['MODE']) {
                    mode.push(row['MODE']);
                    console.log("MODE done")
                }
                if (row['STATE']) {
                    state.push(row['STATE']);
                    console.log("STATE done")
                }
                if (row['AIR_SPEED']) {
                    air_speed.push(row['AIR_SPEED']);
                    console.log("AIR_SPEED done")
                } 
                if (row['HS_DEPLOYED']) {
                    hs_deployed.push(row['HS_DEPLOYED']);
                    console.log("HS_DEPLOYED done")
                } 
            });
            setInterval(display_ct, 1000);
            setInterval(display_pc, 1000);
            setInterval(display_a, 1000);
            setInterval(display_t, 1000);
            setInterval(display_v, 1000);
            setInterval(display_p, 1000);
            setInterval(display_g_la, 1000);
            setInterval(display_g_lo, 1000);
            setInterval(display_ti, 1000);
            setInterval(display_r, 1000);
            setInterval(display_m, 1000);
            setInterval(display_s, 1000);
            setInterval(display_a_s, 1000);
            setInterval(display_hs, 1000);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      })
    .catch(error => console.error('Error fetching CSV:', error));
    })(); 


    
};

// for displaying current time
let index1 = 0;
function display_ct(){
    if(index1<current_time.length){
        console.log(current_time[index1]);
    index1++
    document.getElementById('mission-time').innerHTML = current_time[index1]
    }else{
        return;
    }
};

// packet count
let index2 = 0;
function display_pc(){
    if(index2<packet_count.length){
        console.log(packet_count[index2]);
    index2++
    document.getElementById('packet-count').innerHTML = 'Packet Count:' + packet_count[index2]
    }else{
        console.log(packet_count[index2]);
    }
};

// altitude
let index3 = 0;
function display_a(){
    if(index3<altitude.length){
        console.log(altitude[index3]);
    index3++
    document.getElementById('a').innerHTML = altitude[index3]
    }else{
        return;
    }
};

// temperature
let index4 = 0;
function display_t(){
    if(index4<Temperature.length){
        console.log(Temperature[index4]);
    index4++
    document.getElementById('t').innerHTML = Temperature[index4]
    }else{
        return;
    }
};

// voltage
let index5 = 0;
function display_v(){
    if(index5<voltage.length){
        console.log(voltage[index5]);
    index5++
    document.getElementById('v').innerHTML = voltage[index5]
    }else{
        return;
    }
};

// pressure
let index6 = 0;
function display_p(){
    if(index6<pressure.length){
        console.log(pressure[index6]);
    index6++
    document.getElementById('p').innerHTML = pressure[index6]
    }else{
        return;
    }
};

// gps_latitude
let index7 = 0;
function display_g_la(){
    if(index7<gps_latitude.length){
        console.log(gps_latitude[index7]);
    index7++
    document.getElementById('g_la').innerHTML = gps_latitude[index7]
    }else{
        return;
    }
};

// gps_longitude
let index8 = 0;
function display_g_lo(){
    if(index8<gps_longitude.length){
        console.log(gps_longitude[index8]);
    index8++
    document.getElementById('g_lo').innerHTML = gps_longitude[index8]
    }else{
        return;
    }
};

// tilt
let index9 = 0;
function display_ti(){
    if(index9<tilt_x_y.length){
        console.log(tilt_x_y[index9]);
    index9++
    document.getElementById('g_ti').innerHTML = tilt_x_y[index9]
    }else{
        return;
    }
};

// spin
let index10 = 0;
function display_r(){
    if(index10<gyro_rate.length){
        console.log(gyro_rate[index10]);
    index10++
    document.getElementById('g_r').innerHTML = gyro_rate[index10]
    }else{
        return;
    }
};

// mode
let index11 = 0;
function display_m(){
    if(index11<mode.length){
        console.log(mode[index11]);
    index11++
    document.getElementById('m').innerHTML = mode[index11]
    }else{
        return;
    }
};

// state
let index12 = 0;
function display_s(){
    if(index12<state.length){
        console.log(state[index12]);
    index12++
    document.getElementById('s').innerHTML = state[index12]
    }else{
        return;
    }
};

// air_speed
let index13 = 0;
function display_a_s(){
    if(index13<air_speed.length){
        console.log(air_speed[index13]);
    index13++
    document.getElementById('a_s').innerHTML = air_speed[index13]
    }else{
        return;
    }
};

// hs deployed
let index14 = 0;
function display_hs(){
    if(index14<hs_deployed.length){
        console.log(hs_deployed[index14]);
    index14++
    document.getElementById('h_s').innerHTML = hs_deployed[index14]
    }else{
        return;
    }
};

// Sample data for testing
altitude.push(1000);
Temperature.push(25);
voltage.push(12);
pressure.push(1013);
gps_latitude.push(34.0522);
gps_longitude.push(-118.2437);
tilt_x_y.push("0,0");
gyro_rate.push(0);
mode.push("AUTO");
state.push("ACTIVE");
air_speed.push(200);
hs_deployed.push("YES");