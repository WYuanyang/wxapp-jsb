// pages/game/index.js
Page({
  data:{
    percent:0,
    stageHidden:true,
    //遮罩，防止恶意连续点击剪刀石头布图片；
    //tip:开发工具中wx.showToast(loading)会阻止页面所有事件，
    //但在真机测试中有问题，所以自己加了个阻止事件的遮罩
    maskHidden:true,
    progressHidden:false,
    winNum:0,
    successionWinNum:0,
    sayWords:"请出拳吧，骚年！",
    winOrlose:"",
    playerImg:" ",
    pcImg:" ",
    winNumAnimation:'',
    sayWordsAnimation:''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.preloadImgs();
  },
  onReady:function(){
    // 页面渲染完成
    

  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getImages:function(){
    //节省包资源大小，从服务器上获取图片
    var imgs = {
      jd:'http://ac-w38tecoi.clouddn.com/c059085d155df23dea6d.png',
      jdWin:'http://ac-w38tecoi.clouddn.com/b0e326a84a688e0d30fa.png',
      jdLose:'http://ac-w38tecoi.clouddn.com/66f421ac1e8232a659a8.png',
      st:'http://ac-w38tecoi.clouddn.com/30eadef2395eb77cbafb.png',
      stWin:'http://ac-w38tecoi.clouddn.com/bd322768621e59fb09c4.png',
      stLose:'http://ac-w38tecoi.clouddn.com/26402ef16728336c95f2.png',
      bu:'http://ac-w38tecoi.clouddn.com/79258cd700140855155d.png',
      buWin:'http://ac-w38tecoi.clouddn.com/156f466bfb9c2a984fd2.png',
      buLose:'http://ac-w38tecoi.clouddn.com/45fb4db935a17cbd4e62.png'
    }

    return imgs;
  },
  preloadImgs:function(){//服务器图片预加载
      var count = 0;
      var that = this;
      var imgs = this.getImages();
			var preLoadRes = [imgs.jd,imgs.jdWin,imgs.jdLose,imgs.st,imgs.stWin,imgs.stLose,imgs.bu,imgs.buWin,imgs.buLose];
			for(var i=0;i<preLoadRes.length;i++){
				wx.request({
          url: preLoadRes[i],
          complete: function(res) {
            count++;
            var percent = (count/preLoadRes.length).toFixed(2)*100;
              that.setData({
                percent:percent
              }); 
              if(percent >= 100){
                 that.showStage();
              }
          }
        });
			}
		},
    showStage:function(){
          this.setData({
              stageHidden:false,
              progressHidden:true,
          });
    },
    getResult:function(a,b){//获取猜拳结果
      /*
      定义剪刀==1，石头==2，布==3
      a为玩家的选择，b为电脑随机生成，c为差值结果
      */
      var winOrlose, c = a-b;
      var state={
        win:false,
        lose:false,
        draw:false
      };
      if(c==-2||c==1){
        state.win = true;//赢
      }else if(c==-1||c==2){
        state.lose = true ;//输
      }else{
        state.draw = true;//平局
      }
      return state;
    },
    setWinOrloseTxt:function(txt){//动态显示输赢标识语
      this.setData({
        winOrlose:txt
      });
    },
    setSayWords:function(successionNum){//设置不同的称号用语
      var that = this;
      var sayword = "";
      if(successionNum <= 0){
        sayword="请出拳吧，骚年！"
      }else if(successionNum>0&&successionNum<=3){
        sayword="不错哟，骚年！"
      }else if(successionNum>3&&successionNum<=5){
        sayword="骚年乃诸葛在世也！"
      }else{
        sayword="超神啦！^_^"
      }
      that.setData({
        sayWords:sayword,
        sayWordsAnimation:"transform: scale(1.4)"
      });
      setTimeout(function(){//移除动画样式
        that.setData({
          sayWordsAnimation:""
        });
      },200);
    },
    setWinNumTxt:function(num,successionNum){//总获胜次数
      var that = this;
      this.setData({
        winNum:num,
        winNumAnimation:"transform: scale(2)"
      });
      setTimeout(function(){//移除动画样式
        that.setData({
          winNumAnimation:""
        });
      },200);
    },
    beforePlay:function(){//每次玩之前清除结果区数据
      this.setData({
        winOrlose:"",
        maskHidden:false,
        playerImg:"../images/alpha.png",
        pcImg:"../images/alpha.png" 
      });
    },

    play:function(event){//点击剪刀石头布图片开始游戏
      var that = this;
      var playerVal = parseInt(event.currentTarget.dataset.val);//获取代表剪刀石头布的数字
      var randomVal = parseInt(Math.random()*3+1,10);//随机生成1-3的整数
      var result = this.getResult(playerVal,randomVal);
      that.beforePlay();
      wx.showToast({
        title: '小五思考中...',
        icon: 'loading'
      });
      setTimeout(function(){
        wx.hideToast();
        that.setResultImg(result,playerVal,randomVal);
        that.setData({
          maskHidden:true
        });
      },2000)
      
    },
    setResultImg:function(state,player,pc){//设置比赛结果显示对应的输赢图片
      var imgs = this.getImages();
      var imgName = ["jd","st","bu"];
      var playerImg = imgName[player-1];
      var pcImg = imgName[pc-1];
      var winOrlose;
      var winNum = this.data.winNum;//获胜总次数
      var successionWinNum = this.data.successionWinNum;//连续获胜次数

        if(state.win){
          winOrlose = "Win!";
          winNum++;successionWinNum++;
          this.setData({
            playerImg:imgs[playerImg+"Win"],
            pcImg:imgs[pcImg+"Lose"],
            successionWinNum:successionWinNum
          });
          this.setWinNumTxt(winNum);
        }
        if(state.lose){
          winOrlose = "Lose!";
          this.setData({
            playerImg:imgs[playerImg+"Lose"],
            pcImg:imgs[pcImg+"Win"],
            successionWinNum:0//输局重置连续获胜次数
          });
        }
        if(state.draw){
          winOrlose = "Draw!";
          this.setData({
            playerImg:imgs[playerImg],
            pcImg:imgs[pcImg],
            successionWinNum:0//平局重置连续获胜次数
          });
        }
        this.setWinOrloseTxt(winOrlose);
        this.setSayWords(this.data.successionWinNum);
    }



})