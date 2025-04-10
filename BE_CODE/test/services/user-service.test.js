// const userService = require("../../app/services/user-services");
// const db = require("../../app/models");
// const helper = require("../helper.test");

// describe("User Service", () => {
//   let req, res;

//   beforeEach(async () => {
//     await helper.setupTestDatabase();
//     await helper.createTestData();

//     req = {
//       body: {
//         page: 1,
//         pageSize: 10,
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   afterEach(async () => {
//     await helper.clearTestDatabase();
//     jest.clearAllMocks();
//   });

//   describe("getAllUsers", () => {
//     it("should return paginated list of users", async () => {
//       await userService.getAllUsers(req, res);

//       const users = await db.user.findAll({ attributes: { exclude: ["password"] } });

//       expect(res.json).toHaveBeenCalledWith({
//         totalItems: users.length,
//         totalPages: 1,
//         page: 1,
//         pageSize: 10,
//         users: expect.arrayContaining(
//           users.map((u) =>
//             expect.objectContaining({
//               id: u.id,
//               username: u.username,
//               email: u.email,
//             })
//           )
//         ),
//       });
//     });

//     it("should filter users by username", async () => {
//       req.body.username = "johndoe";

//       await userService.getAllUsers(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           users: expect.arrayContaining([
//             expect.objectContaining({ username: "johndoe" }),
//           ]),
//         })
//       );
//     });

//     it("should filter users by fullName LIKE", async () => {
//       req.body.fullName = "Jane";

//       await userService.getAllUsers(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           users: expect.arrayContaining([
//             expect.objectContaining({ fullName: expect.stringMatching(/Jane/) }),
//           ]),
//         })
//       );
//     });

//     it("should filter users by email LIKE", async () => {
//       req.body.email = "bob@";

//       await userService.getAllUsers(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           users: expect.arrayContaining([
//             expect.objectContaining({ email: "bob@example.com" }),
//           ]),
//         })
//       );
//     });

//     it("should filter users by sex", async () => {
//       req.body.sex = "1";

//       await userService.getAllUsers(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           users: expect.arrayContaining([
//             expect.objectContaining({ sex: "1" }),
//           ]),
//         })
//       );
//     });

//     it("should filter users by dob (exact day)", async () => {
//       req.body.dob = "1990-01-01";

//       await userService.getAllUsers(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           users: expect.arrayContaining([
//             expect.objectContaining({ dob: expect.stringContaining("1990-01-01") }),
//           ]),
//         })
//       );
//     });

//     it("should filter users by createdAt", async () => {
//       const user = await db.user.findOne({ where: { username: "johndoe" } });
//       const createdAt = user.createdAt.toISOString().split("T")[0];

//       req.body.createdAt = createdAt;

//       await userService.getAllUsers(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           users: expect.arrayContaining([
//             expect.objectContaining({ id: user.id }),
//           ]),
//         })
//       );
//     });

//     it("should return 500 if an error occurs", async () => {
//       jest.spyOn(db.user, "findAndCountAll").mockRejectedValue(new Error("Unexpected error"));

//       await userService.getAllUsers(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({
//         error: "Internal Server Error",
//       });
//     });
//     it("should return correct pagination when total users > pageSize", async () => {
//       req.body.page = 1;
//       req.body.pageSize = 3;
    
//       //await helper.createMoreUsers(5); // helper tạo thêm 5 user
      
//       await helper.createTestData();
//       await userService.getAllUsers(req, res);
    
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           page: 1,
//           pageSize: 3,
//           totalPages: expect.any(Number),
//           users: expect.any(Array),
//         })
//       );
    
//       expect(res.json.mock.calls[0][0].users.length).toBeLessThanOrEqual(2);
//     });
//     it("should return the correct users for page 2", async () => {
//       req.body.page = 2;
//       req.body.pageSize = 1;
    
//       await userService.getAllUsers(req, res);
    
//       const allUsers = await db.user.findAll({ attributes: { exclude: ["password"] } });
//       const expectedUser = allUsers[1]; // trang 2, mỗi trang 1 user
    
//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           page: 2,
//           users: expect.arrayContaining([
//             expect.objectContaining({ id: expectedUser.id }),
//           ]),
//         })
//       );
//     });

//     it("should return 400 if page or pageSize is invalid", async () => {
//       req.body.page = "abc"; // không phải số
    
//       await userService.getAllUsers(req, res);
    
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Invalid pagination parameters",
//       });
//     });
    
    
//   });

//   describe("getUserById", () => {
//     it("should return user by ID without password", async () => {
//       const user = await db.user.findOne({ where: { username: "johndoe" } });
//       req = { params: { id: user.id } };

//       await userService.getUserById(req, res);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({
//           id: user.id,
//           username: user.username,
//           email: user.email,
//         })
//       );

//       const returnedUser = res.json.mock.calls[0][0];
//       expect(returnedUser.password).toBeUndefined();
//     });

//     it("should return 404 if user not found", async () => {
//       req = { params: { id: 99999 } };

//       await userService.getUserById(req, res);

//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "User not found",
//       });
//     });

//     it("should return 500 if an error occurs", async () => {
//       req = { params: { id: 1 } };

//       jest.spyOn(db.user, "findByPk").mockRejectedValue(new Error("Unexpected error"));

//       await userService.getUserById(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Internal server error",
//       });
//     });
//     it("should return 400 if id is not a number", async () => {
//       req.params = { id: "abc" };
    
//       await userService.getUserById(req, res);
    
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Invalid user ID",
//       });
//     });
    
//   });


 
// });
// describe("User Service - updateUser", () => {
//   let req, res, existingUser;

//   beforeEach(async () => {
//     await helper.setupTestDatabase();
//     await helper.createTestData();

//     existingUser = await db.user.findOne({ where: { username: "johndoe" } });

//     req = {
//       body: {
//         id: existingUser.id,
//         fullName: "John Doe Updated",
//         password: "newpassword123",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   afterEach(async () => {
//     await helper.clearTestDatabase();
//     jest.clearAllMocks();
//   });

//   it("should update user info successfully", async () => {
//     await userService.updateUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: "User info updated successfully",
//     });

//     const updatedUser = await db.user.findByPk(existingUser.id);
//     expect(updatedUser.fullName).toBe("John Doe Updated");
//     const passwordMatch = await bcrypt.compare("newpassword123", updatedUser.password);
//     expect(passwordMatch).toBe(true);
//   });

//   it("should return 400 if id is missing", async () => {
//     req.body.id = undefined;

//     await userService.updateUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: "Id is required",
//     });
//   });

//   it("should return 404 if user not found", async () => {
//     req.body.id = 9999;

//     await userService.updateUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: "User not found",
//     });
//   });

//   it("should ignore immutable fields like username, email, phoneNumber", async () => {
//     req.body.username = "newusername";
//     req.body.email = "new@email.com";
//     req.body.phoneNumber = "9999999999";

//     await userService.updateUser(req, res);

//     const updatedUser = await db.user.findByPk(existingUser.id);
//     expect(updatedUser.username).toBe("johndoe");
//     expect(updatedUser.email).toBe("johndoe@example.com");
//     expect(updatedUser.phoneNumber).toBe(existingUser.phoneNumber);
//   });

//   it("should return 500 if update throws an error", async () => {
//     jest.spyOn(db.user.prototype, "update").mockImplementation(() => {
//       throw new Error("Mock error");
//     });

//     await userService.updateUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: "Error updating user info",
//     });
//   });
// });



const userService = require("../../app/services/user-services");
const db = require("../../app/models");
const helper = require("../helper.test");

describe("user Service", () => {
let req, res;

beforeEach(async () => {
  await helper.setupTestDatabase();
  await helper.createTestData();

  req = {
    body: {},
    params: {},
  };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

afterEach(async () => {
  await helper.clearTestDatabase();
  jest.clearAllMocks();
});

describe("userService.getAllUsers", () => {


  it("GAU1: should return paginated users without filters", async () => {
    req.body = { page: 1, pageSize: 2 };

    await userService.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      totalItems: 3,
      totalPages: 2,
      page: 1,
      pageSize: 2,
      users: expect.any(Array),
    }));
  });

  it("GAU2:should filter users by exact username", async () => {
    req.body = { username: "johndoe" };
  
    await userService.getAllUsers(req, res);
  
    const result = res.json.mock.calls[0][0];
    expect(result.totalItems).toBe(1);
    expect(result.users[0].username).toBe("johndoe");
  
    // Kiểm tra truy vấn từ DB có khớp
    const dbUser = await db.user.findOne({ where: { username: "johndoe" } });
    expect(dbUser).not.toBeNull();
  });

   


  it("GAU3:should filter users by partial email and verify match in DB", async () => {
    req.body = { email: "jane@" };
  
    await userService.getAllUsers(req, res);
  
    const result = res.json.mock.calls[0][0];
  
    // Truy vấn lại từ DB
    const dbUsers = await db.user.findAll({
      where: {
        email: {
          [db.Sequelize.Op.like]: `%jane@%`,
        },
      },
    });
  
    expect(result.totalItems).toBe(dbUsers.length);
    expect(result.users[0].email).toBe(dbUsers[0].email);
  });
  it("GAU4:should filter users by sex and verify with DB", async () => {
    req.body = { sex: "1" }; // Nữ
  
    await userService.getAllUsers(req, res);
    const result = res.json.mock.calls[0][0];
  
    const dbUsers = await db.user.findAll({ where: { sex: "1" } });
  
    expect(result.totalItems).toBe(dbUsers.length);
    expect(result.users.every(u => u.sex === "1")).toBe(true);
  });
  it("GAU5: should filter users by createdAt and compare with DB query", async () => {
    const user = await db.user.findOne({ where: { username: "janesmith" } });
    const createdAtDate = user.createdAt.toISOString().split("T")[0];
  
    req.body = { createdAt: createdAtDate };
  
    await userService.getAllUsers(req, res);
    const result = res.json.mock.calls[0][0];
  
    // Tính start/end trong ngày
    const startOfDay = new Date(`${createdAtDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${createdAtDate}T23:59:59.999Z`);
  
    const dbUsers = await db.user.findAll({
      where: {
        createdAt: {
          [db.Sequelize.Op.between]: [startOfDay, endOfDay],
        },
      },
    });
  
    expect(result.totalItems).toBe(dbUsers.length);
    expect(result.users.map(u => u.id)).toEqual(
      expect.arrayContaining(dbUsers.map(u => u.id))
    );
  });
  // it("GAU2: should return filtered users by fullName", async () => {
  //   req.body = { fullName: "Jane" };

  //   await userService.getAllUsers(req, res);

  //   const result = res.json.mock.calls[0][0];
  //   expect(result.totalItems).toBe(1);
  //   expect(result.users[0].fullName).toContain("Jane");
  // });

  it("GAU6:should return filtered users by dob", async () => {
    req.body = { dob: "1990-01-01" };

    await userService.getAllUsers(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.totalItems).toBe(1);
    expect(result.users[0].dob).toContain("1990-01-01");
  });

  
  it("GAU7: should combine multiple filters and return correct user from DB", async () => {
    req.body = {
      fullName: "Jane",
      sex: "1",
      email: "jane@example.com",
    };
  
    await userService.getAllUsers(req, res);
  
    const result = res.json.mock.calls[0][0];
  

    expect(result.totalItems).toBe(1);
    expect(result.users[0].fullName).toBe("Jane Smith");
  
 
    const dbUser = await db.user.findOne({
      where: {
        fullName: {
          [db.Sequelize.Op.like]: `%Jane%`,
        },
        sex: "1",
        email: {
          [db.Sequelize.Op.like]: `%jane@example.com%`,
        },
      },
    });
  
    expect(dbUser).not.toBeNull();
    expect(dbUser.fullName).toBe("Jane Smith");
    expect(dbUser.sex).toBe("1");
    expect(dbUser.email).toBe("jane@example.com");
  });

  // it("should paginate results correctly", async () => {
  //   req.body = { page: 2, pageSize: 2 };

  //   await userService.getAllUsers(req, res);

  //   const result = res.json.mock.calls[0][0];
  //   expect(result.page).toBe(2);
  //   expect(result.pageSize).toBe(2);
  //   expect(result.users.length).toBeGreaterThanOrEqual(1);
  // });

  
        

  it("GAU8: should filter user by id and verify with DB", async () => {
    // Lấy một user thật từ DB
    const dbUser = await db.user.findOne({ where: { username: "janesmith" } });
  
    req.body = { id: dbUser.id };
  
    await userService.getAllUsers(req, res);
  
    const result = res.json.mock.calls[0][0];
  
    // Kiểm tra kết quả trả về
    expect(result.totalItems).toBe(1);
    expect(result.users[0].id).toBe(dbUser.id);
    expect(result.users[0].username).toBe(dbUser.username);
  
    // Xác minh kết quả khớp với DB
    const confirmedUser = await db.user.findByPk(result.users[0].id);
    expect(confirmedUser).not.toBeNull();
    expect(confirmedUser.username).toBe("janesmith");
  });

      it("GAU9: should return 500 if an error occurs", async () => {
      jest.spyOn(db.user, "findAndCountAll").mockRejectedValue(new Error("Unexpected error"));

      await userService.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  
});


describe("userService.getUserById", () => {
  // it("should return user by ID", async () => {
  //   const user = await db.user.findOne({ where: { username: "johndoe" } });
  //   req.params.id = user.id;

  //   await userService.getUserById(req, res);

  //   expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
  //     id: user.id,
  //     username: user.username,
  //   }));
  // });
  it("GUBI1: should return user by ID and exclude password field", async () => {
    const user = await db.user.findOne({ where: { username: "johndoe" } });
    req.params.id = user.id;
  
    await userService.getUserById(req, res);
  
    const result = res.json.mock.calls[0][0];
  
    expect(result.id).toBe(user.id);
    expect(result.username).toBe(user.username);
    
    // ⚠️ Kiểm tra chính xác không có field password
    expect(Object.prototype.hasOwnProperty.call(result, "password")).toBe(false);
  });
  
  it("GUBI2: should return 404 if user not found", async () => {
    req.params.id = 9999;

    await userService.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
  it("GUBI3: should return 500 if an error occurs", async () => {
    req = { params: { id: 1 } };

    jest.spyOn(db.user, "findByPk").mockRejectedValue(new Error("Unexpected error"));

    await userService.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });

  


 
});

describe("userService.updateUser", () => {
  it("UU1: should update user information successfully", async () => {
    const user = await db.user.findOne({ where: { username: "janesmith" } });

    req.body = {
      id: user.id,
      fullName: "Jane Updated",
      password: "newpassword123"
    };

    await userService.updateUser(req, res);

    const updatedUser = await db.user.findByPk(user.id);

    expect(updatedUser.fullName).toBe("Jane Updated");
    expect(updatedUser.password).not.toBe("newpassword123"); // password must be hashed

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User info updated successfully",
    });
  });

  it("UU2: should return 404 if user not found", async () => {
    req.body = { id: 9999 };

    await userService.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found",
    });
  });

  it("UU3: should return 400 if id is missing", async () => {
    req.body = {};

    await userService.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Id is required",
    });
  });

  // it("should not update username, email, or phoneNumber even if provided", async () => {
  //   const user = await db.user.findOne({ where: { username: "johndoe" } });
  
  //   req.body = {
  //     id: user.id,
  //     username: "newusername",
  //     email: "new@example.com",
  //     phoneNumber: "0000000000",
  //     fullName: "Updated John",
  //   };
  
  //   await userService.updateUser(req, res);
  
  //   const updatedUser = await db.user.findByPk(user.id);
  
  //   expect(updatedUser.username).toBe("johndoe"); // không thay đổi
  //   expect(updatedUser.email).toBe("john@example.com");
  //   expect(updatedUser.phoneNumber).toBe("0123456789");
  //   expect(updatedUser.fullName).toBe("Updated John");
  // });

  it("UU4: should not crash with invalid data types", async () => {
    const user = await db.user.findOne({ where: { username: "bobwilson" } });
  
    req.body = {
      id: user.id,
      sex: 999, // không hợp lệ
    };
  
    await userService.updateUser(req, res);
  
    const updatedUser = await db.user.findByPk(user.id);
  
    // Trường hợp này hệ thống vẫn update vì không có ràng buộc tại controller,
    // Nếu sau này cần validate thì thêm validation ở service.
    expect(updatedUser.sex).toBe("999"); // Sequelize có thể lưu string hoặc số tuỳ config
  });
  
  
});

describe("userService.deleteUser", () => {
  it("DU1: should delete user successfully", async () => {
    const user = await db.user.findOne({ where: { username: "bobwilson" } });
    req.body = { id: user.id };

    await userService.deleteUser(req, res);

    const deletedUser = await db.user.findByPk(user.id);
    expect(deletedUser).toBeNull();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User deleted successfully",
    });
  });

  it("DU2: should return 404 if user not found", async () => {
    req.body = { id: 9999 };

    await userService.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found",
    });
  });

  it("DU3 :should return 400 if id is missing", async () => {
    req.body = {};

    await userService.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Id is required",
    });
  });
  it("DU4: should return 500 if a database error occurs", async () => {
    const user = await db.user.findOne({ where: { username: "bobwilson" } });
    req.body = { id: user.id };
  
    // Giả lập lỗi khi gọi findByPk
    jest.spyOn(db.user, "findByPk").mockRejectedValue(new Error("DB failure"));
  
    await userService.deleteUser(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Server Error",
    });
  });
});
});