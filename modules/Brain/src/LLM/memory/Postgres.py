from psycopg import Connection
from langgraph.checkpoint.postgres import PostgresSaver

class Postgres():
    """
    Class used to hold the configs of the Postgres database
    Thanks to https://medium.com/@sajith_k/using-postgresql-with-langgraph-for-state-management-and-vector-storage-df4ca9d9b89e
    """

    def __init__(self, DB_URI:str):
        """
        Prepares a new connexion to a PostgreSQL database

        Args:
            DB_URI (str): Login URI to this database
        """
        self.__URI = DB_URI
        self.__ready = False
        self.__connection = None
        self.__postgresSaver:PostgresSaver = None
        self.connect()

    def isReady(self) -> bool:
        """
        Checks if the connexion is ready to be used

        Returns:
            bool: Is ready ?
        """
        return self.__ready

    def connect(self):
        """
        Connects to the database
        """
        if not self.isReady():
            self.__connection = Connection.connect(self.__URI, autocommit=True, prepare_threshold=0)
            self.__ready = True

    def close(self):
        """
        Close the connection to the database
        """
        if self.isReady():
            self.__connection.close()
            self.__ready = False

    def getConnection(self) -> Connection:
        """
        Returns the PostgreSQL connexion

        Returns:
            Connection: Ready to use Postgres connexion
        """
        if not self.isReady(): raise Exception("Tried to use Postgres database before connecting to it !")
        return self.__connection

    def toCheckPointSaver(self) -> PostgresSaver:
        """
        Embed this connexion into a PostgresSaver, for use with LangGraph

        Returns:
            PostgresSaver: LangGraph Memory storage, ready to use
        """
        if not self.__postgresSaver:
            # Never defined
            self.__postgresSaver = PostgresSaver(self.getConnection())
            self.__postgresSaver.setup()
        return self.__postgresSaver