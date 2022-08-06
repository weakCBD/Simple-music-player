window.onload = function () {
    axios.defaults.baseURL = 'https://autumnfish.cn'
    // axios.defaults.baseURL = 'http://127.0.0.1:8000'
    var player = document.querySelector('.player').querySelector('audio');
    var box = new Vue({
        el: '#box',
        data: {
            keywords: '',
            songs: [],
            detail: { al: { picUrl: 'media/播放.png' } },
            comments: [],
            url: {},
            isLoading: false,
            pickClass: 'pick',
            cdClass: 'cd',
            wantPlay: false,
            mvUrl: '',
        },
        methods: {
            search: function () {
                axios.get('/search?keywords=' + this.keywords).then(response => {
                    this.songs = response.data.result.songs;
                })
            },
            playSong: function (index, type) {
                this.pickClass = 'pick pick-stopplay';
                this.cdClass = 'cd';
                this.wantPlay = true;
                this.getDetail(index, type);
            },
            getDetail: function (index, type) {
                axios.get('/song/detail?ids=' + this.songs[index].id).then(response => {
                    this.detail = response.data.songs[0];
                    if (type) {
                        this.getUrl();
                        this.getComments();
                        this.isLoading = false;
                        if (this.wantPlay) {
                            this.startPlay();
                            this.wantPlay = false;
                        } else {
                            this.stopPlay();
                        }
                    } else {
                        this.getMv();
                    }
                });
                this.isLoading = true;
            },
            getUrl: function () {
                axios.get('song/url?id=' + this.detail.id).then(response => {
                    this.url = response.data.data[0];
                })
            },
            getComments: function () {
                axios.get('/comment/music?id=' + this.detail.id).then(response => {
                    this.comments = response.data.comments;
                })
            },
            getMv: function () {
                axios.get('/mv/url?id=' + this.detail.mv).then(response => {
                    this.mvUrl = response.data.data.url;
                })
            },
            startPlay: function () {
                this.pickClass = 'pick pick-startplay';
                this.cdClass = 'cd cd-startplay';
            },
            stopPlay: function () {
                this.pickClass = 'pick pick-stopplay';
                this.cdClass = 'cd';
            },
            clearMv: function () {
                this.mvUrl = '';
            }
        }
    })
}