const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList
} = graphql;

// 模拟的数据
const books = [
  {
    id: "1",
    name: "java",
    authorId: "2"
  },
  {
    id: "2",
    name: "spring",
    authorId: "3"
  },
  {
    id: "3",
    name: "nodejs",
    authorId: "1"
  },
  {
    id: "4",
    name: "python",
    authorId: "2"
  },
  {
    id: "5",
    name: "swift",
    authorId: "1"
  },
  {
    id: "6",
    name: "ruby",
    authorId: "3"
  }
];

const authors = [
  {
    name: "tomcat",
    age: 12,
    id: "1"
  },
  {
    name: "jetty",
    age: 22,
    id: "2"
  },
  {
    name: "maven",
    age: 21,
    id: "3"
  }
];

// 作者
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), // 这里要用new的方式来定义类型，不能直接给books指定成GraphQLList
      resolve(parent, args) {
        // 同样的 parent 表示 author的信息，下面就是从parent里拿到id再去books数据里找authorId为当前作者的书本数据
        return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

// 书本
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id:{type: GraphQLID},
    name: {type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
})


// 定义查询方法
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    }
  }
});

// 构建schema并导出
module.exports = new GraphQLSchema({
  query: RootQuery
});
