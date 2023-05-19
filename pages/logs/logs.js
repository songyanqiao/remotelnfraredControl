Page({
  data: {
    liveUrl: ''
  },
  onLoad() {
    const baseUrl = 'ezopen://open.ys7.com/L08132488/1.hd.live';
    const autoplay = 1;
    const accessToken = 'at.20uszt123khbeqi21cp87odj7tnk9xcn-1segxsek5b-1ud54ph-n1xlwgbqd';

    // 拼接参数到视频流地址
    const params = `autoplay=${autoplay}&accessToken=${accessToken}`;
    const fullUrl = `${baseUrl}?${params}`;

    this.setData({
      liveUrl: fullUrl
    });
  },
  onLiveStateChange(event) {
    console.log('Live Player State Change:', event.detail);
  }
});
