/* eslint-disable no-process-env */
export const denyAccessToEnv = (logger = console): void => {
  const p = new Proxy(process.env, {
    get(env, property: string) {
      if (typeof property === 'string') {
        logger.debug(
          { property },
          `Someone tries to read a property from process.env, will be returned an empty string.
            Please, use another way to deal with configuration (https://stackoverflow.com/a/57317215)`
        )
        return ''
      }
      return env[property]
    },
  })

  process.env = p
}
