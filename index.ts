import { prisma } from './generated/prisma-client';
import { GraphQLServer } from 'graphql-yoga';

const resolvers = {
  Mutation: {
    createDraft(parent, args, context) {
      return context.prisma.createPost({
        title: args.title,
        published: args.published,
        author: {
          connect: { id: args.userId }
        }
      });
    },

    publish(parent, args, context) {
      return context.prisma.updatePost({
        where: {
          id: args.postId,
        },
        data: { 
          published: true,
        },
      });
    },

    createUser(parent, args, context) {
      return context.prisma.createUser({
        name: args.name,
        email: args.email,
      })
    },
  },

  User: {
    posts(parent, args, context) {
      return context.prisma.user({
        id: parent.id,
      }).posts();
    },
  },

  Post: {
    author(parent, args, context) {
      return context.prisma.post({
        id: parent.id,
      }).author();
    }
  },
  
  Query: {
    publishedPosts(parent, args, context) {
      return context.prisma.posts({ where: { published: true }})
    },
    post(parent, args, context) {
      return context.prisma.post({ id: args.postId });
    },
    posts(parent, args, context) {
      return context.prisma.posts();
    },
    postsByUser(parent, args, context) {
      return context.prisma.user({
        id: args.userId
      }).posts()
    },
    users(parent, args, context) {
      return context.prisma.users({
        where: {
          id: args.userId
        }
      });
    },
    user(parent, args, context) {
      return context.prisma.user({
          id: args.userId
      });
    },
    getDrafts(parent, args, context) {
      return context.prisma.posts();
    }
  },  
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
});

server.start(() => console.log('Server is running on http://localhost:4000'))
