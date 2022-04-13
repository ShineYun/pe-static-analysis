<template>
  <v-md-editor v-model="text" height="100%" mode="preview" :model-value="markdown"></v-md-editor>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      markdown: '这是一个简单的x86汇编文件\n' +
          '\n' +
          'win32汇编了解基础可见友链：\n' +
          '\n' +
          '作为基础本分会细节描述各个部分\n' +
          '\n' +
          'x86汇编快速入门：\n' +
          '\n' +
          'https://blog.51cto.com/u_15060507/4005079\n' +
          '\n' +
          'https://blog.csdn.net/sky2098/article/details/1566812\n' +
          '\n' +
          'https://blog.csdn.net/team39/article/details/88599561\n' +
          '\n' +
          'x86指令集：\n' +
          '\n' +
          'https://www.cnblogs.com/jentleTao/p/12699894.html\n' +
          '\n' +
          '\n' +
          '\n' +
          '    INCLUDELIB kernel32.lib\n' +
          '    \n' +
          '    .386\n' +
          '    .MODEL flat,stdcall\n' +
          '    \n' +
          '    ;.code\n' +
          '    ExitProcess PROTO,              ; exit program\n' +
          '    dwExitCode:DWORD\t\t; return code\n' +
          '    \n' +
          '    \n' +
          '    .data\n' +
          '    \n' +
          '    .code\n' +
          '    Main PROC\n' +
          '    \n' +
          '    \tmov eax,10000h\t\t; EAX = 10000h\n' +
          '    \tadd eax,40000h\t\t; EAX = 50000h\n' +
          '    \tsub eax,20000h\t\t; EAX = 30000h\n' +
          '    \n' +
          '    \tpush 0h\n' +
          '    \tcall ExitProcess\n' +
          '    \n' +
          '    main ENDP\n' +
          '    END Main\n' +
          '\n' +
          '此程序简单的执行向EAX寄存器写入数据并对其进行加减操作，结束程序通过调用kernel32.lib的库函数退出。\n' +
          '\n' +
          '通过VS下x86生成exe文件。\n' +
          '\n' +
          '用 010editor 观察文件结构\n' +
          '\n' +
          '首先是PE头部分\n' +
          '\n' +
          '\n' +
          '\n' +
          'Dos头不再分析，仅是兼容DOS文件使用\n' +
          '\n' +
          '直接分析NT_HEADERS部分\n' +
          '\n' +
          '（1）PE头标记\n' +
          '\n' +
          '\n' +
          '\n' +
          '（2）文件头部分\n' +
          '\n' +
          'Machine：14Ch  每个CPU都拥有的唯一的Machine码，兼容32位Intel x86芯片的Machine码为14Ch；\n' +
          '\n' +
          'NumverOfSections:5h 节表数目为5\n' +
          '\n' +
          'TimeDateStamp: 时间戳，用于计算创建时间\n' +
          '\n' +
          'PointerToSymbolTable:   指向 COFF 符号表的文件指针，如果不存在 COFF 符号表，则为零。 对于 PE 映像，此值应为零。\n' +
          '\n' +
          'NumberOfSymbols:   获取符号表中的项数。 此数据可用于查找紧跟在符号表后面的字符串表。 对于 PE 映像，此值应为零。\n' +
          '\n' +
          'SizeOfOptionalHeader：获取可选标头的大小，它是可执行文件所必需的，但对象文件不需要它。 对于对象文件，此值应为零。\n' +
          '\n' +
          'Characteristics：获取可指示文件属性的标志。\n' +
          '\n' +
          '\n' +
          '\n' +
          'Optional Header对应信息如下：\n' +
          '\n' +
          '    //大小: 32bit(0xE0) 64bit(0xF0)\n' +
          '     \n' +
          '    #define IMAGE_NUMBEROF_DIRECTORY_ENTRIES    16\n' +
          '     \n' +
          '    typedef struct _IMAGE_OPTIONAL_HEADER {\n' +
          '     \n' +
          '        WORD    Magic;                          //文件类型: 10bh为32位PE文件 / 20bh为64位PE文件\n' +
          '        BYTE    MajorLinkerVersion;             //链接器(主)版本号 对执行没有任何影响\n' +
          '        BYTE    MinorLinkerVersion;             //链接器(次)版本号 对执行没有任何影响\n' +
          '        DWORD   SizeOfCode;                     //包含代码的节的总大小.文件对齐后的大小.编译器填的没用\n' +
          '        DWORD   SizeOfInitializedData;          //包含已初始化数据的节的总大小.文件对齐后的大小.编译器填的没用.\n' +
          '        DWORD   SizeOfUninitializedData;        //包含未初始化数据的节的总大小.文件对齐后的大小.编译器填的没用.(未初始化数据,在文件中不占用空间;但在被加载到内存后,PE加载程序会为这些数据分配适当大小的虚拟地址空间).\n' +
          '        DWORD   AddressOfEntryPoint;            //程序入口(RVA)\n' +
          '        DWORD   BaseOfCode;                     //代码的节的基址(RVA).编译器填的没用(代码节起始的RVA,表示映像被加载进内存时代码节的开头相对于ImageBase的偏移地址,节的名称通常为".text")\n' +
          '        DWORD   BaseOfData;                     //数据的节的基址(RVA).编译器填的没用(数据节起始的RVA,表示映像被加载进内存时数据节的开头相对于ImageBase的偏移地址,节的名称通常为".data")\n' +
          '        DWORD   ImageBase;                      //内存镜像基址\n' +
          '        DWORD   SectionAlignment;               //内存对齐大小\n' +
          '        DWORD   FileAlignment;                  //文件对齐大小\n' +
          '        WORD    MajorOperatingSystemVersion;    //标识操作系统主版本号 \n' +
          '        WORD    MinorOperatingSystemVersion;    //标识操作系统次版本号 \n' +
          '        WORD    MajorImageVersion;              //PE文件自身的主版本号\n' +
          '        WORD    MinorImageVersion;              //PE文件自身的次版本号\n' +
          '        WORD    MajorSubsystemVersion;          //运行所需子系统主版本号\n' +
          '        WORD    MinorSubsystemVersion;          //运行所需子系统次版本号\n' +
          '        DWORD   Win32VersionValue;              //子系统版本的值.必须为0,否则程序运行失败.\n' +
          '        DWORD   SizeOfImage;                    //内存中整个PE文件的映射尺寸.可比实际的值大.必须是SectionAlignment的整数倍\n' +
          '        DWORD   SizeOfHeaders;                  //所有头+节表按照文件对齐后的大小.\n' +
          '        DWORD   CheckSum;                       //校验和.大多数PE文件该值为0.在内核模式的驱动程序和系统DLL中,该值则是必须存在且是正确的.在IMAGEHLP.DLL中函数CheckSumMappedFile就是用来计算文件头校验和的,对于整个PE文件也有一个校验函数MapFileAndCheckSum.\n' +
          '        WORD    Subsystem;                      //文件子系统  驱动程序(1) 图形界面(2) 控制台/DLL(3)\n' +
          '        WORD    DllCharacteristics;             //文件特性.不是针对DLL文件的\n' +
          '        DWORD   SizeOfStackReserve;             //初始化时保留的栈大小.该字段默认值为0x100000(1MB),如果调用API函数CreateThread时,堆栈参数大小传入NULL,则创建出来的栈大小将是1MB.\n' +
          '        DWORD   SizeOfStackCommit;              //初始化时实际提交的栈大小.保证初始线程的栈实际占用内存空间的大小,它是被系统提交的.这些提交的栈不存在与交换文件里,而是在内存中.\n' +
          '        DWORD   SizeOfHeapReserve;              //初始化时保留的堆大小.用来保留给初始进程堆使用的虚拟内存,这个堆的句柄可以通过调用函数GetProcessHeap获得.每一个进程至少会有一个默认的进程堆,该堆在进程启动时被创建,而且在进程的生命期中不会被删除.默认值为1MB.\n' +
          '        DWORD   SizeOfHeapCommit;               //初始化时实践提交的堆大小.在进程初始化时设定的堆所占用的内存空间,默认值为PAGE_SIZE. \n' +
          '        DWORD   LoaderFlags;                    //调试相关\n' +
          '        DWORD   NumberOfRvaAndSizes;            //目录项数目,默认为10h.\n' +
          '        IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];//结构数组 数组元素个数由IMAGE_NUMBEROF_DIRECTORY_ENTRIES定义\n' +
          '    } IMAGE_OPTIONAL_HEADER32, * PIMAGE_OPTIONAL_HEADER32;\n' +
          '\n' +
          '\n' +
          '\n' +
          '对于静态解析而言我们仅仅需要具体理解其中9个\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          'Magic: 区别32位和64位PE文件\n' +
          '\n' +
          'AddressOfEntryPoint：持有EP的RVA值，指出程序最先执行的代码起始地址\n' +
          '\n' +
          'ImageBase：指出文件的优先装入地址（32位进程虚拟内存范围为：0～7FFFFFFF）\n' +
          '\n' +
          'SectionAlignment,FileAlignment：前者制定了节表在内存中的最小单位，后者制定了节表在磁盘文件中的最小单位\n' +
          '\n' +
          'SizeOfImage：指定了PE Image在虚拟内存中所占空间的大小\n' +
          '\n' +
          'SizeOfHeaders：指出整个PE头的大小\n' +
          '\n' +
          'Subsystem：区分系统驱动文件和普通可执行文件\n' +
          '\n' +
          'NumberOfRvaAndSize：指定DataDirectory数组的个数\n' +
          '\n' +
          'DataDirectory：由IMAGE_DATA_DIRECTORY结构体组成的数组\n' +
          '\n' +
          '\n' +
          '\n' +
          '各个节表内部结构如下：\n' +
          '\n' +
          '\n' +
          '\n' +
          'VirtualSize：内存中节表所占大小\n' +
          '\n' +
          'VirtualAddress：内存中节表起始地址（RVA）\n' +
          '\n' +
          'SizeOfRawData：磁盘文件中节表所占大小\n' +
          '\n' +
          'Charateristics：节表属性（bit OR）\n' +
          '\n' +
          '\n' +
          '\n' +
          '随后紧接着是对应的节表内容：\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          'IMAGE_IMPORT_DESCRIPTOR\n' +
          '\n' +
          '记录着PE文件要导入哪些库文件\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '\n' +
          '这里导入了kernel32.lib下的ExitProcess程序\n' +
          '\n' +
          '\n',
    };
  },
}
</script>

<style scoped>

</style>