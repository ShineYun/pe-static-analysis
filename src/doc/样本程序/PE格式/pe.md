# PE文件格式详细解析（一）

## 一、PE文件基本介绍

PE文件是Windows操作系统下使用的一种可执行文件，由COFF（UNIX平台下的通用对象文件格式）格式文件发展而来。32位成为PE32，64位称为PE+或PE32+。

## 二、PE文件格式

1. PE文件种类如下表所示：

| 种类         | 主扩展名           |
| ------------ | ------------------ |
| 可执行系列   | EXE, SCR           |
| 库系列       | DLL, OCX, CPL, DRV |
| 驱动程序系列 | SYS, VXD           |
| 对象文件系列 | OBJ                |

1. 基本结构

   使用010editor（二进制文件查看工具）打开一个exe可以看到如下结构：

   ![PE_struc1](https://zhuanlan.kanxue.com/upload/attach/202003/779730_XVVPANDT27JXJQG.jpg)

   上图是该exe文件的起始部分，也是PE文件的头部，exe运行所需要的所有信息都存储在PE头中。

![PE_struc2](https://zhuanlan.kanxue.com/upload/attach/202003/779730_PECPNSY7TQQTZ26.jpg)

 

 从DOS头到节区头是PE头部分，其下的节区合称为PE体。文件中使用偏移（offset），内存中使用VA（Virtual Address，虚拟地址）来表示位置。文件加载到内存时，情况就会发生变化（节区大小、位置等）。文件的内容一般可分为代码（.text）、数据（.data）、资源（.rsrc）节，分别保存。PE头与各节区的尾部存在一个区域，成为NULL填充。文件/内存中节区的起始位置应该在各文件/内存最小单位的倍数上，空白区域使用NULL进行填充（如上图所示）。

1. VA&RVA

   VA指进程虚拟内存的绝对地址，RVA（Relative Virtual Address，相对虚拟地址）指从某个基准未知（ImageBase）开始的相对地址。VA与RVA的换算满足如下公式：

    **RVA + IamgeBase = VA**

   PE头内部信息主要以RVA的形式进行存储，主要原因是PE文件（主要是DLL）加载到进程虚拟内存的特定位置时， 该位置可能已经加载了其他PE文件（DLL）。此时需要进行重定位将其加载到其他的空白位置，保证程序的正常运行。

## 三、PE头

1. DOS头

   主要为现代PE文件可以对早期的DOS文件进行良好兼容存在，其结构体为IMAGE_DOS_HEADER。

   大小为64字节，其中2个重要的成员分别是：

   - e_magic:DOS签名（4D5A，MZ）
   - e_lfanew：指示NT头的偏移（文件不同，值不同）

2. DOS存根

   stub，位于DOS头下方，可选，大小不固定，由代码与数据混合组成。

3. NT头

   结构体为IMAGE_NT_HEADERS，大小为F8，由3个成员组成：

   - 签名结构体，值为50450000h（“PE”00）
   - 文件头，表现文件大致属性，结构体为IMAGE_FILE_HEADER，重要成员有4个：
     - Machine：每个CPU都拥有的唯一的Machine码，兼容32位Intel x86芯片的Machine码为14C；
     - NumberOfSections：指出文件中存在的节区数量；
     - SizeOfOptionalHeader：指出结构体IMAGE_OPTIONAL_HEADER32（32位系统）的长度
     - Characteristics：标识文件属性，文件是否是可运行形态、是否为DLL等，以bit OR形式进行组合
   - 可选头，结构体为IMAGE_OPTIONAL_HEADER32，重要成员有9个：
     - Magic：IMAGE_OPTIONAL_HEADER32为10B，IMAGE_OPTIONAL_HEADER64为20B
     - **AddressOfEntryPoint**：持有EP的RVA值，指出程序最先执行的代码起始地址
     - ImageBase：指出文件的优先装入地址（32位进程虚拟内存范围为：0～7FFFFFFF）
     - SectionAlignment,FileAlignment：前者制定了节区在内存中的最小单位，后者制定了节区在磁盘文件中的最小单位
     - SizeOfImage：指定了PE Image在虚拟内存中所占空间的大小
     - SizeOfHeaders：指出整个PE头的大小
     - Subsystem：区分系统驱动文件和普通可执行文件
     - NumberOfRvaAndSize：指定DataDirectory数组的个数
     - DataDirectory：由IMAGE_DATA_DIRECTORY结构体组成的数组

4. 节区头

   节区头中定义了各节区的属性，包括不同的特性、访问权限等，结构体为IMAGE_SECTION_HEADER，重要成员有5个：

   - VirtualSize：内存中节区所占大小
   - VirtualAddress：内存中节区起始地址（RVA）
   - SizeOfRawData：磁盘文件中节区所占大小
   - Charateristics：节区属性（bit OR）

## 四、RVA To RAW

PE文件从磁盘到内存的映射：

1. 查找RVA所在节区

2. 使用简单的公式计算文件偏移：

   **RAW - PointerToRawData = RVA - ImageBase**

   **RAW = RVA - ImageBase + PointerToRawData**

example：ImageBase为0x10000000，节区为.text，文件中起始地址为0x00000400，内存中的起始地址为0x01001000，RVA = 5000，RAW = 5000 - 1000 + 400 = 4400。



# PE文件格式详细解析（二）--IAT

**IAT，导入地址表（Import Address Table），保存了与windows操作系统核心进程、内存、DLL结构等相关的信息。只要了理解了IAT，就掌握了Windows操作系统的根基。IAT是一种表格，用来记录程序正在使用哪些库中的哪些函数。**

## 一、DLL

DLL，动态链接库（Dynamic Linked Library）

### 1. 来源

在16位的DOS环境中，不存在DLL的概念，例如在C中使用printf函数时，编译器会先从C库中读取相应函数的二进制代码，然后插入到应用程序中。但是Windows支持多任务，采用这种包含库的方式会没有效率，因为如果每个程序在运行时都将Windows库中的函数加载进来，将造成严重的内存浪费，因此引入了DLL的概念。

### 2. 设计理念

1. 不把函数库包含进应用程序中，单独组成DLL文件，在需要使用时再进行调用。
2. 使用内存映射技术将加载后的DLL代码、资源在多个进程中实现共享。
3. 在对函数库进行更新时，只更新DLL文件即可。

### 3. 加载方式

DLL加载方式有两种：**显式链接（Explicit Linking）** 和 **隐式链接（Implicit Linking）**

- 显示链接：程序在使用DLL时进行加载，使用完毕后释放内存

- 隐式链接：程序在开始时即一同加载DLL，程序终止时再释放占用的内存

  **IAT提供的机制与DLL的隐式链接有关。**

## 二、DLL调用的简单理解

在OD中查看程序的反汇编代码如下所示:

 

![iat](https://zhuanlan.kanxue.com/upload/attach/202003/779730_VGUK6GEYU52UHHR.jpg)

 

在调用ThunRTMain()函数时，并非是直接调用函数，而是通过获取0x00405164地址处的值-0x7400A1B0，该值是加载到待分析应用程序进程内存中的ThunRTMain()函数的地址。

 

需要注意的是，此处之所以编译器不直接进行jmp 7400A1B0主要是因为以下两点：

- DLL版本不同，由于操作系统的版本存在差异，DLL文件版本也会存在差异
- DLL重定位，DLL文件的ImageBase一般为0x10000000，如果应用程序同时有两个DLL文件需要加载--a.dll和b.dll，在运行时a.dll首先加载进内存，占到了0x10000000，此时b.dll如果再加载到0x10000000，就会发生冲突，所以需要加载到其他的空白内存空间处。

## 三、IMAGE_IMPORT_DESCRIPTOR结构体

## 1. 结构介绍

该结构体中记录着PE文件要导入哪些库文件，因为在执行一个程序时需要导入多个库，所以导入了多少库，就会存在多少IMAGE_IMPORT_DESCRIPTOR结构体，这些结构体组成数组，数组最后以NULL结构体结束。部分重要成员如下所示：

| 成员          | 含义                                        |
| ------------- | ------------------------------------------- |
| OriginalThunk | INT的地址（RVA），4字节长整型数组，NULL结束 |
| Name          | 库名称字符串的地址（RVA）                   |
| FirstThunk    | IAT的地址（RVA），4字节长整型数组，NULL结束 |

 

下图描述了notepad.exe之kernel32.dll的IMAGE_IMPORT_DESCRIPTOR结构：

 

![iat1](https://zhuanlan.kanxue.com/upload/attach/202003/779730_KEADX85NFN488FU.jpg)

## 2. PE装载器把导入函数输入至IAT的顺序

1. 读取IID的Name成员，获取库名称字符串（eg：kernel32.dll）

2. 装载相应库：

   LoadLibrary("kernel32.dll")

3. 读取IID的OriginalFirstThunk成员，获取INT地址

4. 逐一读取INT中数组的值，获取相应IMAGE_IMPORT_BY_NAME地址（RVA）

5. 使用IMAGE_IMPORT_BY_NAME的Hint（ordinal）或Name项，获取相应函数的起始地址：

   GetProcAddress("GetCurrentThreadld")

6. 读取IID的FirstThunk（IAT）成员，获得IAT地址

7. 将上面获得的函数地址输入相应IAT数组值

8. 重复以上步骤4～7，知道INT结束（遇到NULL）

## 四、总结

IAT是在学习PE文件格式中重要的一部分，也是比较难的一部分，需要仔细学习，一定要熟练掌握。建议根据实际的PE文件结合前面的分析步骤，亲自动手多加分析，不断熟悉分析流程。

# PE文件格式详细解析（三）--EAT

 **Windows操作系统中，库是为了方便其他程序调用而集中包含相关函数的文件（DLL、SYS）。Win32 API是最具有代表性的库，其中kernel32.dll文件被称为最核心的库文件。**

## 一、基础知识

 EAT是一种核心机制，使不同的应用程序可以调用库文件中提供的函数，只有通过EAT才能准确求得从相应库中到处函数的起始地址。PE文件内的IMAGE_EXPORT_DIRECTORY保存着导出信息，且PE文件中**仅有一个**用来说明EAT的IMAGE_EXPORT_DIRECTORY结构体。

 

```
备注：IAT的 IMAGE_IMPORT_DESCRIPTOR结构体以数组形式存在，且有多个成员，这主要是因为PE文件可以同时导入多个库。
```

## 二、IMAGE_EXPORT_DIRECTORY结构体

### 1. 在PE头中的位置

 在PE头中，IMAGE_OPTIONAL_HEADER32.DataDirectory[0].VirtualAddress的值几十IMAGE_EXPORT_DIRECTORY结构体数组的起始地址（RVA）。下图显示的是kernel32.dll文件的IMAGE_OPTIONAL_HEADER32.DataDirectory[0]:

 

![eat1](https://zhuanlan.kanxue.com/upload/attach/202003/779730_32TZHNEH7RQAPVF.jpg)

 

其中第一个4字节为VirtualAddress，第二个4字节为Size。

### 2. 详细的结构代码

详细的结构代码如下：

 

![eat2](https://zhuanlan.kanxue.com/upload/attach/202003/779730_RN2TD9747SW5G6H.jpg)

 

下面对结构体中的部分重要成员进行解释（全部地址均为RVA）：

| 项目                  | 含义                                                |
| --------------------- | --------------------------------------------------- |
| NumberOfFuctions      | 实际Export函数的个数                                |
| NumberOFNames         | Export函数中具名的函数个数                          |
| AddressOfFunctions    | Export函数地址数组（数组元素个数=NumberOfFuctions） |
| AddrssOfNames         | 函数名称地址数组（数组元素个数=NumberOfNames）      |
| AddressOfNameOrdinals | Ordinal地址数组（元素个数=NumberOfNames）           |

### 3. kernel32.dll文件的IMAGE_EXPORT_DIRECTORY结构体

下图中描述的是kernel32.dll 文件的IMAGE_EXPORT_DIRECTORY结构体与整个的EAT结构：

 

![eat3](https://zhuanlan.kanxue.com/upload/attach/202003/779730_7HXD6CYRBH5QTP4.jpg)

 

从库中获得函数地址的API为GetProcAddress()函数，该API引用EAT来获取指定API的地址。其过程大致如下：

1. 利用AddressOfName成员转到“函数名称数组”
2. “函数名称数组”中存储着字符串地址，通过比较（strcmp）字符串，查找指定的函数名称（此时数组的索引称为name_index）
3. 利用AddressOfNameOrdinals成员，转到ordinal数组
4. 在ordinal数组中通过name_index查找相应ordinal值
5. 利用AddressOfFunctionis成员转到“函数地址数组”（EAT）
6. 在“函数地址数组”中将刚刚求得的ordinal用作数组索引，获得指定函数的起始地址

kernel32.dll中所有到处函数均有相应名称，AddressOfNameOrdinals数组的值以index=ordinal的形式存在。但存在一部分dll中的导出函数没有名称，所以仅通过ordinal导出，从Ordinal值中减去IMAGE_EXPORT_DIRECTORY.Base 成员后得到一个值，使用该值作为“函数地址数组”的索引即可查找到相应函数的地址。

## 三、完整的kernel32.dll的EAT的解析过程

以下以查找kernel32.dll中的AddAtomW函数为例，串联整个过程：

1. 由前面第一个图的VirtualAddress和Size可以获得IMAGE_EXPORT_DIRECTORY结构体的RAW为1A2C，计算过程如下：

   **RAW = RVA - VA + PTR = 262C - 1000 + 400 = 1A2C**(此处仅以书上地址为例，每个人地址会不同)

2. 根据IMAGE_EXPORT_DIRECTORY结构的详细代码可以获得AddressOfNames成员的值为RVA =353C，RAW=293C。使用二进制查看软件查看该地址：

![eat4](https://zhuanlan.kanxue.com/upload/attach/202003/779730_5QT7Y8SRAMC4KB4.jpg)

 

此处为4字节RVA组成的数组，数组元素个数为NumberOfNames（3BA）。

1. 查找指定函数名称

   函数名称为“ AddAtomW”，在上图中找到RVA数组的第三个元素的值RVA:4BBD -> RAW:3FBD，进入相应地址即可看到该字符串，函数名为数组的第三个元素，数组索引为2.

   ![eat5](https://zhuanlan.kanxue.com/upload/attach/202003/779730_7WVTC3AB8YY7BX5.jpg)

2. Ordinal数组

   AddressOfNameOrdinals成员的值为RVA:4424 -> RAW:3824:

   ![eat6](https://zhuanlan.kanxue.com/upload/attach/202003/779730_TSA2ZZT9SVBSG8S.jpg)

   oridinal数组中各元素大小为2字节。

3. ordinal

   将4中确定的index值2应用到数组即可求得Ordinal(2)

   `AddressOfNameOrdinals[index] = ordinal(index = 2, ordinal = 2)`

4. 函数地址数组 - EAT

   AddressOfFunctions成员的值为RVA:2654 -> RVA:1A54：

   ![eat7](https://zhuanlan.kanxue.com/upload/attach/202003/779730_85X9YYQEN2YPARJ.jpg)

5. AddAtomW函数地址

   将5中求得的Ordinal用于上图数组的索引，求得RVA = 00326F1

   `AddressOfFunctionis[ordinal] = RVA(ordinal = 2,RVA = 326F1)`

   书中kernel32.dll 的ImageBase为7C7D0000，所以AddAtomW函数的实际地址VA = 7C7D0000 + 326F1 = 7C8026F1

   以上地址可以使用od进行验证，此处不多赘述。

   # PE文件格式详细解析（四）-- 运行时压缩及UPX压缩调试

   ## 一、数据压缩

   1. 无损压缩（Lossless Data Compression）：经过压缩的文件能百分百恢复

      使用经过压缩的文件之前，需要点对文件进行解压缩（此过程需要保证数据完整性），常见的ZIP、RAR等是具有嗲表性的压缩文件格式，使用的压缩算法通常为Run-Length、Lepel-ZIV、Huffman等。

   2. 有损压缩（Loss Data Compression）：经过压缩的文件不能恢复原状

      允许压缩文件（数据）时损失一定信息，以此换取高压缩率，多媒体文件多采用有损压缩方式，但不会影响人的视觉、听觉体验。

   ## 二、运行时压缩器

    针对可执行文件，文件内部含有解压缩代码，文件在运行瞬间于内存中解压缩后执行。

   1. 压缩器（Packer）：将普通PE文件创建成运行时压缩文件的应用程序
      - 目的：缩减PE文件大小；隐藏PE文件内部代码与资源
      - 种类：目的纯粹（UPX、ASPack等）、目的不纯粹（UPack、PESpin、NSAnti等）
   2. 保护器（Protector）：经反逆向技术特别处理的压缩器
      - 目的：防止破解，隐藏OEP（Original Entry Point）；保护代码与资源
      - 种类：商用（ASProtect、Themida、SVKP等）、公用（UltraProtect、Morphine等）

   ## 三、运行时压缩测试（notepad.exe）

    书上使用的是XP SP3的notepad.exe，此处使用的是win7 x64下的notepad.exe ，因此部分数据会产生不同。

   ```
   ### 1. 压缩notepad.exe
   ```

   1. 下载UPX，地址http://upx.sourceforge.net，进行解压，并将notepad.exe拷贝到同级目录下

   2. 进行压缩：`upx.exe -o notepad_upx.exe notepad.exe`

      第一个参数为输出的文件名，第二个参数为待压缩文件名（如果不在同级目录下，需要使用绝对路径）。

      压缩结果如下：

      ![upx1](https://zhuanlan.kanxue.com/upload/attach/202003/779730_EVR8RZP9NZVP8PE.jpg)

      可以看到在文件大小上存在明显的尺寸减小（193536->151552）。这个压缩率比ZIP压缩要低一些，主要是因为PE文件压缩后要添加PE头，还要添加解压缩代码。

   ### 2. 比较notepad.exe与 notepad_upx.exe

   1. 下图(以书上版本为例)从PE文件视角比较2个文件，可以反映出UPX压缩器的特点：

   ![upx2](https://zhuanlan.kanxue.com/upload/attach/202003/779730_B24MNVKRFY3YHHS.jpg)

   1. 细节比较：

      - PE头大小一致（0～400h）
      - 节区名发生变化（红框）
      - 第一个节区的RawDataSize = 0（文件中的大小为0）
      - EP文娱第二个节区，压缩前位于第一个节区
      - 资源节区（.rsrc）大小几乎无变化

   2. 探讨UPX创建的空白节区，也就是RawDataSize=0的节区。使用PEView查看（此处为本机使用的notepad_upx.exe与书上不同）：

      ![upx3](https://zhuanlan.kanxue.com/upload/attach/202003/779730_H99KPGBZVN8VZEW.jpg)

   查看第一个节区的相关数据，VirtualSize的大小为2C000，但是SizeOfRawData的大小为0。UPX为什么要创建一个这么大的空白节区呢？

    

   **原理是：经过UPX压缩的PE文件在运行时将首先将文件中的压缩代码解压到内存中的第一个节区，也就是说，解压缩代码与压缩代码的源代码都在第二个节区中，文件运行时首先执行解压缩代码，把处于压缩状态的源代码解压到第一个节区中，解压过程结束后即运行源文件的EP代码**。

   ## 四、总结

   这里开始初步进入调试阶段，需要好好掌握前面的知识，方便后续调试。下一节将开始od的动态调试。

6. ## 一、未经过UPX压缩的notepad的EP代码

   首先看一下未经过UPX压缩的notepad的相关信息：

   1. PEView查看基本结构信息：

      ![upx4](https://zhuanlan.kanxue.com/upload/attach/202003/779730_PNKTV7Y7R8HYQGK.jpg)

      RVA = 1000，且SizeOfRawData是有大小的。

   2. OD查看EP代码：

      首先简单看一下汇编代码，程序在010073b2处调用kernel32.dll中的GetModuleHandleA()函数，然后可以得到程序的ImageBase，存放在EAX中：

   ![upx8](https://zhuanlan.kanxue.com/upload/attach/202003/779730_J5RSM8TC8FADWB8.jpg)

    

   然后，进行PE文件格式的验证，比较MZ和PE签名。

    

   ![upx7](https://zhuanlan.kanxue.com/upload/attach/202003/779730_GJYD6RX6B8GKGPA.jpg)

    

   以上代码可以简单记录一下，方便后续与经过UPX压缩的程序进行比较。

   ## 二、经过UPX压缩的notepad_upx.exe的EP代码

   1. PEView查看下信息（上一节已经介绍过）：

      第一个图为第一个节区UPX0的信息，第二个图为第二个节区UPX1的信息。

      ![upx5](https://zhuanlan.kanxue.com/upload/attach/202003/779730_AXX5M5PZRKWUVFS.jpg)

      ![upx6](https://zhuanlan.kanxue.com/upload/attach/202003/779730_QPADGP2PMVPUAN2.jpg)

   2. OD进行EP代码查看：

      ![upx9](https://zhuanlan.kanxue.com/upload/attach/202003/779730_EJK5ATWHSKDT868.jpg)

      可以发现经过UPX压缩的EP代码发生了明显的改变，入口地址变为了01014410，该地址其实为第二个节区UPX1的末尾地址（使用PEView可以确认），实际压缩的源代码位于该地址的上方。

      然后我们看一下代码开始部分：

      `01014410    60            pushad``01014411    BE 00000101    mov esi, notepad_.01010000``01014416    8DBE 0010FFFF  lea esi, dword ptr ds:[esi-0xf000]`

      首先看第一句，pushad，其主要作用将eax～edi寄存器的值保存到栈中：

   ![upx10](https://zhuanlan.kanxue.com/upload/attach/202003/779730_E6A8PJ8Z9KY755D.jpg)

    

   结合上面的图，发现在执行完pushad指令后，eax～edi的值确实都保存到了栈中。

    

   后面两句分别把第二个节区的起始地址（01010000）与第一个节区的起始地址（01001000）存放到esi与edi寄存器中。UPX文件第一节区仅存在于内存中，该处即是解压缩后保存源文件代码的地方。

    

   需要注意的是，在调试时同时设置esi与edi，大概率是发生了esi所指缓冲区到edi所指缓冲区的内存复制。此时从Source（esi）读取数据，解压缩后保存到Destination（edi）。

   ## 三、跟踪UPX文件

   **掌握基本信息后，开始正式跟踪UPX文件，需要遵循的一个原则是，遇到循环（loop）时，先了解作用再跳出，然后决定是否需要再循环内部单步调试。**

    

   备注：此处开始使用书上的例子，因为我个人的反汇编的代码会跟书上不一致，不建议新手使用。

   ### 1. 第一个循环

   在EP代码处执行Animate Over（Ctrl+F8）命令，开始跟踪代码：

    

   ![upx11](https://zhuanlan.kanxue.com/upload/attach/202003/779730_EMKSDWNTHFCRJM8.jpg)

    

   跟踪到这里后发现第一个关键循环，涉及到edi的反复变化，循环次数为36b，主要作用是从edx（01001000）中读取一个字节写入edi（01001001）。edi所指的地址即是第一个节区UPX0的起始地址（PEView已经验证过），仅存于内存中，数据全部被填充为NULL，主要是清空区域，防止有其他数据。这样的循环我们跳出即可，在010153e6处下断点，然后F9跳出。

   ### 2. 第二个循环

   在断点处继续Animate Over跟踪代码，遇到下图的循环结构：

    

   ![upx12](https://zhuanlan.kanxue.com/upload/attach/202003/779730_WZ6G37XM73NSSXS.jpg)

    

   该村换是正式的解压缩循环。

    

   先从esi所指的第二个节区（UPX1）地址中依次读取数据，然后经过一系列运算解压缩后，将数据放入edi所指的第一个节区（UPX0）地址。关键指令解释：

   ```
   0101534B  . 8807     mov byte ptr ds:[edi],al``0101534D  . 47      inc edi                 ; notepad_.0100136C``...``010153E0  . 8807     mov byte ptr ds:[edi],al``010153E2  . 47      inc edi                 ; notepad_.0100136C``...``010153F1  . 8907     mov dword ptr ds:[edi],eax``010153F3  . 83C7 04    add edi,0x4``* 解压缩后的数据放在AL（eax）中，edi指向第一个节区的地址
   ```

   在01015402地址处下断，跳出循环（暂不考虑内部压缩过程）。在转储窗口查看解压缩后的代码：

    

   ![upx13](https://zhuanlan.kanxue.com/upload/attach/202003/779730_3H9B27MKVDJCKCA.jpg)

   ### 3. 第三个循环

   重新跟踪代码，遇到如下循环：

    

   ![upx14](https://zhuanlan.kanxue.com/upload/attach/202003/779730_2CEY6BM6TRZFTZ7.jpg)

    

   这部分代码主要是恢复源代码的CALL/JMP指令（机器码：E8/E9）的destination地址。

    

   到此为止，基本恢复了所有的压缩的源代码，最后设置下IAT即可成功。

   ### 4. 第四个循环

   01015436处下断：

    

   ![upx15](https://zhuanlan.kanxue.com/upload/attach/202003/779730_5R27U9WPBQ8JPP3.jpg)

    

   此处edi被设置为01014000，指向第二个节区（UPX1）区域，该区域中保存着原程调用的API函数名称的字符串。

    

   ![upx16](https://zhuanlan.kanxue.com/upload/attach/202003/779730_QXQ99EPHD7NUCEY.jpg)

    

   UPX在进行压缩时，会分析IAT，提取出原程序中调用的额API名称列表，形成api函数名称字符串。

    

   使用这些API名称字符串调用01015467地址处的GetProcAddress()函数，获取API的起始地址，然后把API地址输入ebx寄存器所指的原程序的IAT区域，循环进行，直到完全恢复IAT。

    

   然后，到01054bb的jmp指令处，跳转到OEP（原始EP）代码处：

    

   ![upx17](https://zhuanlan.kanxue.com/upload/attach/202003/779730_JYJFVSUPKJAV42C.jpg)

    

   至此，UPX的解压缩全部完成，后续进行notepad.exe的正常执行。

   ## 五、快速查找UPX OEP的方法

   ### 1. 在POPAD指令后的JMP指令处设置断点

   UPX压缩的特征之一是其EP代码被包含在PUSHAD/POPAD指令之间，并且在POPAD指令之后紧跟着的JMP指令会跳转到OEP代码处，所以可以在此处下断点，直接跳转到OEP地址处。

   ### 2. 在栈中设置硬件断点

   本质上也是利用 PUSHAD/POPAD指令的特点。因为eax～edi的值依次被保存到栈中，不管中间做了什么操作，想要运行OEP的代码就需要从栈中读取这些寄存器的值来恢复程序的原始运行状态，所以我们只要设置硬件断点监视栈中寄存器的值的变化就可以快速定位到OEP。

    

   F8执行完pushad后，在od的dump窗口进入栈地址：

    

   ![upx18](https://zhuanlan.kanxue.com/upload/attach/202003/779730_4BGGTMMXYQPHFFP.jpg)

    

   然后选中下硬件读断点：

    

   ![upx19](https://zhuanlan.kanxue.com/upload/attach/202003/779730_A7F4ND2WAXKQ3PU.jpg)

    

   直接F9，你会发现很快就来到PUSHAD后的JMP指令处。

    

   最后，补充硬件断点的几个知识：硬件断点是CPU支持的断点，最多设置4个；执行完指令后再停止。



# PE文件格式详细解析（六）-- 基址重定位表（Base Relocation Table）

## 一、PE重定位

向进程的虚拟内存加载PE文件时，文件会被加载到PE头的ImageBase所指的地址处。如果是加载的DLL（SYS）文件，且在ImageBase位置处已经加载了DLL（SYS）文件，那么PE装载器就会将其加载到其他未被占用的空间。此时就会发生基址重定位。

 

**使用SDK或VC++创建PE文件，EXE默认的ImageBase为00400000，DLL默认的ImageBase为10000000，使用DDK创建的SYS文件默认的ImageBase为10000。**

 

创建好进程后，因为EXE文件会首先加载进内存，所以EXE文件中无需考虑基址重定位问题。但是需要考虑ASLR（地址随机化）。对于各OS的主要系统DLL，微软会根据不同版本分别赋予不同的ImageBase地址，例如同一系统的kernel32.dll和user32.dll等会被加载到自身固有的ImageBase，所以系统的DLL实际上也不会发生重定位问题。

## 二、PE重定位时发生了什么

以下以书上程序为例（书上是以exe文件举例，纯粹是举例，实际环境中基址重定位多发生在DLL文件中）。

1. 基本信息：

   如下图所示，其ImageBase为01000000

   ![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_4REF7ZTD7N3NW5M.png)

2. 使用OD运行，观察内存：

   下图是程序的EP代码部分，因为ASLR的原因，程序被加载到00270000处。

   ![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_33KAU4TA82495C6.png)

   从图中可以看出，红框内进程的内存地址是以硬编码的方式存在的，地址2710fc、271100是.text节区的IAT区域，地址27c0a4是.data节区的全局变量。因为ASLR的存在，每次在OD中重启程序，地址值就会随加载地址的不同而发生变化，这种使硬编码在程序中的内存地址随当前加载地址变化而改变的处理过程就是PE重定位。

   将以上两个图进行对比整理，数据如下表所示：

| 文件（ImageBase：01000000） | 进程内存（加载地址：00270000) |
| --------------------------- | ----------------------------- |
| 0100010fc                   | 002710fc                      |
| 01001100                    | 00271100                      |
| 0100c0a4                    | 0028c0a4                      |

 

即：因为程序无法预测会被加载到哪个地址，所以记录硬编码地址时以ImageBase为准；在程序运行书简，经过PE重定位，这些地址全部以加载地址为基准进行变换，从而保证程序的正常运行。

## 三、PE重定位操作原理

### 1. 基本操作原理

1. 在应用程序中查找硬编码的地址位置
2. 读取数值后，减去ImageBase（VA->RVA）
3. 加上实际加载地址（RVA->VA）

上面三个步骤即可完成PE重定位，其中最关键的是查找硬编码地址的位置，查找过程中会使用到PE文件内部的Relocation Tables（重定位表），它记录了硬编码地址便宜，是在PE文件构建中的编译/链接阶段提供的。通过重定位表查找，本质上就是根据PE头的“基址重定位表”项进行的查找。

 

![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_SUPZ54EKQBACTVU.png)

 

如上图所示，红框内的硬编码的地址都需要经过重定位再加载到内存中。

### 2. 基址重定位表

位于PE头的DataDirectory数组的第六个元素，索引为5.如下图所示：

 

![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_PS8SPZUGH7XZEJD.png)

 

上图中的基址重定位表的RVA为2f000，查看该地址处内容：

 

![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_VRZFBJS6DQ7Z9WZ.png)

 

![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_YUZDMG2W9TP74S9.png)

### 3. IMAGE_BASE_RELOCATION结构体

上图中详细罗列了硬编码地址的偏移，读取该表就可以获得准确的硬编码地址偏移。基址重定位表是IMAGE_BASE_RELOCATION结构体数组。

 

其定义如下：

```
typedefine struct _IMAGE_BASE_RELOCATION{``    ``DWORD    VirtualAddress;  ``//RVA``值``    ``DOWRD    SizeOfBlock;    ``//``重定位块的大小``    ``//WORD` `TypeOffset[1];    ``//``以注释形式存在，非结构体成员，表示在该结构体下会出现WORD类型的数组，并且该数组元素的值就是硬编码在程序中的地址偏移。``}IMAGE_BASE_RELOCATION;` `tydefine IMAGE_BASE_RELOCATION UNALIGEND * PIMAGE_BASE_RELOCATION;
```

### 4. 基地址重定位表的分析方法

下表列出上图中基址重定位表的部分内容：

| RVA   | 数据     | 注释           |
| ----- | -------- | -------------- |
| 2f000 | 00001000 | VirtualAddress |
| 2f004 | 00000150 | SizeOfBlock    |
| 2f008 | 3420     | TypeOffset     |
| 2f00a | 342d     | TypeOffset     |
| 2f00c | 3436     | TypeOffset     |

 

以VirtualAddress=00001000，SizeOfBlock=00000150，TypeOffset=3420为例。

 

TypeOffset值为2个字节，由4位的Type与12位的Offset合成：

| 类型（4位） | 偏移（12位） |
| ----------- | ------------ |
| 3           | 420          |

 

高4位指定Type，PE文件中常见的值为3（IMAGE_REL_BASED_HIGHLOW），64位的PE文件中常见值为A（IMAGE_REL_BASED_DIR64）。低12位位真正位移（最大地址为1000），改位移是基于VirtualAddress的位移，所以程序中硬编码地址的偏移使用以下公式进行计算：

 

```
VirtualAddress(1000) + Offset(420) = 1420(RVA)
```

 

下面我们在OD中看一下RVA 1420处是否实际存在要执行PE重定位操作的硬编码地址：

 

![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_6W7KCCVKAKHYUXF.png)

 

程序加载的基地址为270000，所以在271420处可以看到IAT的地址（VA，2710c4）。

### 5. 总结流程

1. 查找程序中硬编码地址的位置（通过基址重定位表查找）

   ![img](https://zhuanlan.kanxue.com/upload/attach/20200310/779730_PXCKP3DS6KJ3MXT.png)

   可以看到，RVA 1420处存在着程序的硬编码地址010010c4

2. 读取数值后，减去ImageBase值：

   010010c4 - 01000000 = 000010c4

3. 加上实际加载地址

   000010c4 + 00270000=002710c4

对于程序内硬编码的地址，PE装载器都做如上的处理，根据实际加载的内存地址修正后，将得到的值覆盖到同一位置上。对一个IMAGE_BASE_RELOCATION结构体的所有TypeOffset都做如上处理，且对RVA 1000～2000地址区域对应的所有硬编码地址都要进行PE重定位处理。如果TypeOffset值为0，说明一个IMAGE_BASE_RELOCATION结构体结束。至此，完成重定位流程。