import React, { Component } from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import SystemSetting from 'react-native-system-setting'

export default class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            bgColor:true,
            interval:[0,1500,1000,500,350,200],
            intervalSelect:5,
            needUpdate:false
        }
    }
    async componentDidMount(){
        setTimeout(() => {
            this.changeColor()
        }, this.state.interval[this.state.intervalSelect]);
        await this.initSound()
        let aa = await this.checkVersion()
        if (aa > 3) {
            this.setState({needUpdate:true})
        }
    }
    async checkVersion() {
        try {
          let response = await fetch(
            'https://versioncheck-40500.firebaseio.com/sos/version/.json',
          );
          let responseJson = await response.json();
          return responseJson;
        } catch (error) {
            // alert(JSON.stringify(error));
        }
    }
    async initSound(){
        SystemSetting.setAppBrightness(1)
        SystemSetting.setBrightness(1)
        SystemSetting.setBrightnessForce(1)
        SystemSetting.setVolume(1);
        await TrackPlayer.setupPlayer().then(() => {
            // The player is ready to be used
        });
        var track = {
            id: 'unique track id', // Must be a string, required
            
            url: require('./sos.mp3'), // Load media from the app bundle
            
            title: 'zaulaa.com',
            artist: 'zaulaa.com',
            album: 'zaulaa.com',
            genre: 'Progressive House, Electro House',
            date: '2014-05-20T07:00:00+00:00', // RFC 3339
             
            artwork: require('./assets/sos.jpg'), // Load artwork from the app bundle 
        };
        let playlist = [];
        for (let i = 0; i < 200; i++) {
            playlist[i] = track
        }
        await TrackPlayer.add(playlist).then(function() {
            // The tracks were added
        });
        TrackPlayer.setVolume(1);
        TrackPlayer.play();
        TrackPlayer.set

    }
    async changeInt(param){ 
        
        let temp = this.state.intervalSelect
        await this.setState({intervalSelect:param})
        // alert(temp + " - " +this.state.intervalSelect)
        if (temp==0) {
            this.changeColor()
            TrackPlayer.play();
        } 
        if(this.state.intervalSelect == 0){
            TrackPlayer.pause(); 
        }else{
            SystemSetting.setVolume(1);
        }
    }
    changeColor(){
        if (this.state.intervalSelect > 0) {
            this.setState({bgColor:!this.state.bgColor})
            setTimeout(() => {
                this.changeColor()
            }, this.state.interval[this.state.intervalSelect]);

        }
    }
    render() {
        return (
            <View style={{ flex: 1,height:"100%"}}>
                <View style={{flex:1,height:'100%',justifyContent:"center",backgroundColor:(this.state.bgColor ? "red" : "white" )}}>
                    <Text style={{fontSize:140,fontWeight:"bold",transform: [{ rotate: "90deg" }], color:(!this.state.bgColor ? "red" : "white" ) }}>S.O.S</Text>
                </View>
                <View style={{position:"absolute", width:"100%",bottom:10, flex:1,flexDirection:"row",justifyContent:"center"}}>
                    {
                        this.state.interval.map((dt,i)=>{
                            return (
                                <TouchableOpacity onPress={()=>{this.changeInt(i)}} style={{flexDirection:"column", paddingVertical:8, paddingHorizontal:13,alignItems:"center",margin:2,borderRadius:4, backgroundColor:"red",justifyContent:"center"}}>
                                    <Text style={{color:"white"}}>{i==0 ? "STOP": i }</Text>
                                </TouchableOpacity>
                            )
                        })  
                    }
                </View>
                <Text style={{position:"absolute", bottom:0, fontSize:8,right:0, color:"rgba(255,0,0,1)"}}>@zzaula</Text>
                {this.state.needUpdate && 
                <View style={{position:"absolute", bottom:0, top:0, flex:1, width:"100%",backgroundColor:'#000000',color:"#fff",justifyContent:"center"}}>
                    <Text style={{color:"white", width:"100%",textAlign:"center"}}>Application Need Update</Text>
                    <Text style={{color:"white",width:'100%',textAlign:"center"}}>Please check on playstore :)</Text>
                </View>
                }
            </View>
        );
    }
}