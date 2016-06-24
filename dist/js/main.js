
// connect to database
var horizon = Horizon({host: 'localhost:8181'});
horizon.onReady(function() {
  console.log("Connected to Horizon.")
});
horizon.connect();


var articles = horizon("articles");
var history = horizon("history");

/*
structure of article objects

article = {
  title: "string",
  content: "markdown string",
  changeDate: "date",
  changeAuthor: "string",
  linkId: "string"
}

rethinkdb handles _id
*/


// Components
var articleView = Vue.extend({
  name : "articleView",
  template: '#articleView',
  data: function() {
    return {
      article: {
        title: "",
        content: "",
        linkId: "",
      }
    }
  },
  route: {
    data: function () {
      this.article = {
        title: "",
        content: "",
        linkId: "",
      };

      var articleQuery = this.$route.params.linkId;
      articles.find({linkId: articleQuery}).fetch().subscribe(
        (result) => {
          this.article = result;
        },
        (err) => console.error("Fetch Article failed!"),
        (completed) => {
          if (this.article.linkId == "") {
            //non-existing article, reroute to create page
            router.go("/" + this.$route.params.linkId + "/create");
          }
        }
      );
    }
  }
});

var articleEditView = Vue.extend({
  name: "articleEditView",
  template: '#articleEditView',
  data: function() {
    return {
      article:  {
        title: "",
        content: "",
        linkId: "",
      }
    }
  },
  methods: {
    backToArticleView: function () {
      router.go("/" + this.$route.params.linkId);
    },
    saveEdit: function() {
      articles.upsert({
        id: this.article.id,
        title: this.article.title,
        content: this.article.content,
        linkId: this.article.linkId
      });
    }
  },
  route: {
    data: function () {
      this.article = {
        title: "",
        content: "",
        linkId: "",
      };

      var articleQuery = this.$route.params.linkId;
      articles.find({linkId: articleQuery}).fetch().subscribe(
        (result) => {
          this.article = result;
        },
        (err) => console.error("Fetch Article failed!"),
        (completed) => {
          if (this.article.linkId == "") {
            //non-existing article, reroute to create page
            router.go("/" + this.$route.params.linkId + "/create");
          }
        }
      );
    }
  }
});

var articleCreateView = Vue.extend({
  name: "articleCreateView",
  template: '#articleCreateView',
  data: function() {
    return {
      article:  {
        title: "",
        content: "",
        linkId: "",
      }
    }
  },
  methods: {
    backToArticleView: function () {
      router.go("/" + this.$route.params.linkId);
    },
    saveEdit: function() {
      articles.upsert({
        id: this.article.id,
        title: this.article.title,
        content: this.article.content,
        linkId: this.article.linkId
      });
    }
  },
  route: {
    data: function () {
      this.article = {
        title: "",
        content: "",
        linkId: "",
      };

      var articleQuery = this.$route.params.linkId;
      articles.find({linkId: articleQuery}).fetch().subscribe(
        (result) => {
          this.article = result;
        },
        (err) => console.error("Fetch Article failed!"),
        (completed) => {
          if (this.article.linkId !== "") {
            //existing article, reroute to edit page
            router.go("/" + this.$route.params.linkId + "/edit");
          }
          else { this.article.linkId = this.$route.params.linkId }
        }
      );
    }
  }
});


// Filters
// Markdown Parser
Vue.filter('marked', function(value) {
  return marked(value);
});


// Routing
var App = Vue.extend({});
var router = new VueRouter();

// !! use ONLY single qoutes on paths ('/path') !!
router.map({
  '/:linkId': {
    component: articleView
  },
  '/:linkId/edit': {
    component: articleEditView
  },
  '/:linkId/create': {
    component: articleCreateView
  }
});

router.redirect({
  // redirect '/' to main page
  '/': '/main'
});

router.start(App, '#content');



// generate UUIDs
function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
