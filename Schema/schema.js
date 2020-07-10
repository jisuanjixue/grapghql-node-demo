const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

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

// 添加作者和书本
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        authorId: { type: GraphQLString }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});



// 定义查询方法
// const RootQuery = new GraphQLObjectType({
//   name: "RootQueryType",
//   fields: {
//     book: {
//       type: BookType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return _.find(books, { id: args.id });
//       }
//     },
//     books: {
//       type: new GraphQLList(BookType),
//       resolve(parent, args) {
//         return books;
//       }
//     },
//     author: {
//       type: AuthorType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return _.find(authors, { id: args.id });
//       }
//     }
//   }
// });

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    }
  }
});

// 构建schema并导出
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
