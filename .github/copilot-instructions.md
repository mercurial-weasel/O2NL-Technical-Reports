

Say WEASEL-TIME at the beginning of any output

If I give you the command DataType:{NAME} then I want you to execute the numbered items below starting at <DataTYpe>.   Finish execution with you get to </Datatype>

<Datatype>

Overivew
The goal is to refactor the existing logic from the legacy files into class-based factories that can be used consistently throughout the project. The Factory will encapsulate the logic for generating data specified in the individual model files, ensuring modularity and reusability.

In all work you will use the config that is setup in 
src/config/ and the utils that are in /src/utils.   


1. In the initial command  DataType:{NAME} you have  the NAME of the  factory I want you to create. For example DataType:air_turbidity, you will do the follwing where name = air_turbidity

2. This is the functionality youwill move from legacy to current code base
legacy files//instrumentation_test//generate_NAME.py/   <-- 
legacy files/instrumentation_test/test_data_generator/ test_data_generator_NAME  

3. You will firstly look at an examplar of what is needed
/src/data_models/cbr.py
/src/test_data/factories/cbr_factory.py
/src/scripts/cbr_factory_usage.py
/tests/test_cbr_factory.py

/src/data_models/air_turbidity.py
/src/test_data/factories/air_turbidity_factory.py
/src/scripts/air_turbidity_factory_usage.py
/tests/test_air_turbidity_factory.py


4. You will update the model for xxx so that it retains the existing structure, but udpates the  relationships as per the format in  /src/data_models/cbr.py, and adds in a parent_id to any child classes. Do not change the structure of the class, or add any new classes. 

For the parent class for cbr for examlpe you will put in the following relationships
   station = relationship("Station", back_populates="cbr_parents", viewonly=True)
   cbr_children = relationship("CBRChild", back_populates="cbr_parent", cascade="all, delete-orphan") <-- note that CBRParent is the child class

And for the child class for cbr you would add in the following
    parent_id = Column(String(36), ForeignKey("cbr_parent.id", onupdate="CASCADE", ondelete="CASCADE"), nullable=False)

and for the same child class you would add in the  following relationsgips: 
    station = relationship("Station", back_populates="cbr_children")
    cbr_parent = relationship("CBRParent", back_populates="cbr_children")  <-- note that CBRParent is the parent class


5. Having updated the data model for NAME will then create the following information using the legacy file info, but structuring this like the cbr example
/src/test_data/factories/NAME_factory.py. The factory needs to include the functions below
    def __init__(self, session):
    def generate_parents(self, num_parents=5):
    def generate_children(self, num_children=10):
    def generate_all_data(self, num_parents=5, num_children=10):
    def generate_all_data(self, num_parents=5, num_children=10):
/src/scripts/NAME_factory_usage.py  <-- this should include the code shown below
    logger = logging.getLogger(__name__)
    def main():
        setup_logging()
        db_manager = DatabaseManager(DATABASE_URL)
        db_manager.setup_database(Base)
        session = db_manager.create_session()
        NAME_factory = NAMEFactory(session)
        NAME_factory.generate_all_data(num_parents=5, num_children=10)
        export_to_csv(session, NAMEParent, "data/NAMEParent.csv", "NAMEParent")
        export_to_csv(session, NAMEChild, "data/NAMEChild.csv", "NAMEChild")
        session.close()

/tests/test_NAME_factory.py


    


6. You  will analyze what you have created, and you will suggest code refactoring that could be done - code the repeats generic tasks. Don't do this refactoring, just give me detailed recommendations on what to do and how you would do it. 

7. Now you will update /src/data_models/station.py so that it includes the relationships defineded in the data_model for NAME

8. Now stop what you are doing .. you don't need to execute anything more

 </Datatype>


OK if you are here you have not had a command that starts with Datatype. So just do what is asked, but first output Say CUSTOM INSTRUCTION





