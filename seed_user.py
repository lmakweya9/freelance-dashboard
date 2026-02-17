from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import User, Base, hash_password  # Importing from your main.py

# 1. Connect to the same database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_initial_user():
    db = SessionLocal()
    
    # Check if user already exists
    username = "admin"
    existing_user = db.query(User).filter(User.username == username).first()
    
    if existing_user:
        print(f"User '{username}' already exists!")
    else:
        # Create hashed password
        # You can change 'password123' to whatever you want
        hashed = hash_password("password123")
        
        new_user = User(username=username, hashed_password=hashed)
        db.add(new_user)
        db.commit()
        print(f"Successfully created user: {username}")
    
    db.close()

if __name__ == "__main__":
    create_initial_user()