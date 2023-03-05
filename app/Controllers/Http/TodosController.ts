import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Todo from "../../Models/Todo";

export default class TodosController {
    public async index() {
        const todos = await Todo.all()
        return todos.map((todo) => todo.serialize({
            fields: ['title', 'id']
        }))
    }
    // with paginnation
    // public async index({ request }: HttpContextContract) {
    //     const page = request.input('page', 1)
    //     const limit = request.input('per_page', 2)
    //     return Todo.query().paginate(page, limit)
    // }

    
    public async store({ request, response }: HttpContextContract) {
        const todo = await Todo.create({ title: request.body().title, is_completed: false })
        return response.created({ message: 'created', todo: todo})
    }

    public async update({ response, request, params }: HttpContextContract) {
        const todo = await Todo.findOrFail(params.id)
        todo.title = request.input('title')
        todo.is_completed = request.input('is_completed')
        todo.save()
        return response.status(202).send(todo)
    }

}
