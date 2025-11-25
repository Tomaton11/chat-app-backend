import Workspace from "../models/Workspace.model.js";
import { ServerError } from "../utils/error.utils.js";

class WorkspaceRepository {
    async findWorkspaceById (id){
        console.log(id)
        return await Workspace.findById(id)
    }
    async createWorkspace({name, owner_id}){
        const workspace = await Workspace.create(
            {
                name, 
                owner: owner_id,
                members: [owner_id] 
            }
        )
        return workspace
    }

    async addNewMember({workspace_id, owner_id, invited_id}){
        const workspace_found = await this.findWorkspaceById(workspace_id)

        //Que exista el workspace
        if(!workspace_found){
            throw new ServerError('Workspace not found', 404)
        }

        //Que sea el dueño

        if(!workspace_found.owner.equals(owner_id)){
            throw new ServerError('You are not the owner of this workspace', 403)
        }

        //Que el invitado ya no sea miembro del workspace
        if(workspace_found.members.includes(invited_id)){
            throw new ServerError('Is already a member', 400)
        }

        workspace_found.members.push(invited_id)
        await workspace_found.save()
        return workspace_found
    }
//nuveo
    async getUserWorkspaces(user_id) {
    return await Workspace.find({
        members: user_id
    }).populate('owner', 'username email'); // Opcional: para traer info del owner
}

async getUserWorkspacesByOwnerAndMembership(user_id) {
    const workspaces = await Workspace.find({
        members: user_id
    }).populate("owner", "username email");
    const owned = []
    const member = []

    for (const ws of workspaces) {
        //si el usuario es el owner
        if (ws.owner.equals(user_id)){
            owned.push(ws);
        } else {
            member.push(ws)
        }
    }
    return { owned, member };
    }
}




const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository