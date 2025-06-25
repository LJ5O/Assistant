class ToolConfig():

    def __init__(self, chatHidden=False, listHidden=False):
        """
        Configuration for model tools. Used to determine how tools are represented accross the front-end.

        Args:
            chatHidden (bool, optional): Is this tool shown while discussing with the model ? Defaults to False.
            listHidden (bool, optional): Should we hide this tool in the tool list ? Defaults to False.
        """
        self.chatHidden = chatHidden
        self.listHidden = listHidden

    def __str__(self) -> str:
        return ( # More debug than useful
            'ToolConfig : \n'+
            'Hidden in discussion: '+str(self.chatHidden)+
            '\nHidden in tools lists: '+str(self.listHidden)
        )