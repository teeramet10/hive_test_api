const bodyParser = require('koa-body');
const Koa = require('koa');
const json = require('koa-json')
const cors = require('@koa/cors');
const app = new Koa();
const Router = require('koa-router');


const router = new Router();

app.use(cors());
app.use(async (ctx, next) => {
   const start = Date.now();
   await next();
   const ms = Date.now() - start;
   console.log(` [${ctx.status}] ${ctx.method}  ${ctx.url} - ${ms}ms` );
});

app.use(async (ctx, next) => {
   try {
      await next();
   } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = Utils.setError(err.status, err.message)
      console.log(Utils.setError(err.status, err.message));
      ctx.app.emit('error', err, ctx);
   }
});


router.get('/', (ctx, next) => {

   ctx.body = {
      "message" : "Hello"
   };
   ctx.status = 200
	next();
});

router.get('/get_authen', (ctx, next) => {

   ctx.body = {
      "token_type" : "Bearer",
      "access_token" : "dkflkasdjnflksdjfo;",
      "refresh_token" : "sal;dkjalksjdf;sdfj",
      "expires_in" : "200"
   };
   ctx.status = 200
	next();
});

router.get('/test_error', (ctx, next) => {
   ctx.body = {
      "error" : "error"
   }
   ctx.status = 401
	next();
});



router.post('/add', (ctx, next) => {
   const body = ctx.request.body
   var titleCode = body.titleCode;
   print(titleCode);
   ctx.body = {
     "id":titleCode
   }
   ctx.status = 200
	next();
});


router.get('/test_400', (ctx, next) => {
   ctx.body = {
     "domain":"/test400",
     "code" : "400",
     "message" : "Error",
   }
   ctx.status = 400
	next();
});


app.use(router.routes());

app.use(json());
app.use(bodyParser({
   formLimit: '25mb',
   multipart: true,
   urlencoded: true
}));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT).on('error', (err, ctx) => {
   return ctx
});

module.exports = server;