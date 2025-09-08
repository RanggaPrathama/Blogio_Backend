import 'reflect-metadata';
import { createServerLocal } from './server.js';
import { ColorsTerminals } from './types/general.js';
import  colors from 'colors';


(async () => {
  const { serverHttp, graphqlUrl } = await createServerLocal();


  serverHttp.listen(process.env.PORT, () => {
    console.log(colors.yellow("\nBLOGIO"))
    console.log(
      `\nisDev = ${process.env.NODE_ENV === 'development' ? colors.green('true') : colors.red('false')} | isStaging = ${process.env.NODE_ENV === 'staging' ? colors.green('true') : colors.red('false')} | isProd = ${process.env.NODE_ENV === 'production' ? colors.green('true') : colors.red('false')}\n`

    )
    console.log(ColorsTerminals.logInfo(`App running in ${process.env.NODE_ENV || 'development'} mode`));
    console.log(ColorsTerminals.logSuccess(`🚀 Server ready at ${graphqlUrl}`))
  });
})()