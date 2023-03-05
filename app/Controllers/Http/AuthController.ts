import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from "@ioc:Adonis/Core/Validator"
import User from '../../Models/User'

export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        const validation = schema.create({
            email: schema.string({}, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string({}, [
                rules.confirmed()
            ])
        })
        const data = await request.validate({ schema: validation })
        const user = await User.create(data)
        return response.created({ user: user })
    }

    public async login({request, response, auth }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        try {
            const token = await auth.use('api').attempt(email, password)
            return token
        } catch {
            return response.unauthorized('Invalid credentials')
        }
    }
}

