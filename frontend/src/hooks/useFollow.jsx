import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const useFollow = (amIFollowing) => {
    const queryClient = useQueryClient()
    const { mutate:follow, isPending} = useMutation({
        mutationFn: async(userId)=>{
            try {
                const response = await fetch(`/api/user/follow/${userId}`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                const data = await response.json()
                if(data.error){
                    throw new Error(data.error || "Something went wrong")
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: () => {
            toast.success("User followed / unfollowed successfully")
            Promise.all(
                queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey: ["authUser"]})
            )
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });
    return {follow, isPending};
}

export default useFollow;